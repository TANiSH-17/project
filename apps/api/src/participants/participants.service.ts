import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async accrueFromClicks(participationId: string) {
    const part = await this.prisma.participation.findUnique({ where: { id: participationId }, include: { campaign: true } });
    if (!part) throw new NotFoundException('Participation not found');
    const totalClicks = await this.prisma.click.count({ where: { participationId } });
    const alreadyAccruedUnits = await this.prisma.earningAccrual.aggregate({
      where: { participationId, metricType: 'CLICKS' },
      _sum: { value: true }
    });
    const accrued = alreadyAccruedUnits._sum.value ?? 0;
    const delta = Math.max(0, totalClicks - accrued);
    if (delta === 0) return { created: false, delta, totalClicks };
    const amount = Math.floor((delta * part.campaign.ratePerThousand) / 1000);
    const holdDays = parseInt(process.env.HOLD_DAYS ?? '3', 10);
    const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000);
    const accrual = await this.prisma.earningAccrual.create({
      data: {
        participationId,
        metricType: 'CLICKS',
        value: delta,
        amount,
        currency: part.campaign.currency,
        status: 'PENDING',
        holdUntil,
      },
    });
    return { created: true, accrual };
  }

  async lockEligible(participationId: string) {
    const part = await this.prisma.participation.findUnique({ where: { id: participationId }, include: { campaign: true } });
    if (!part) throw new NotFoundException('Participation not found');
    const now = new Date();
    const pending = await this.prisma.earningAccrual.findMany({ where: { participationId, status: 'PENDING', holdUntil: { lte: now } } });
    if (pending.length === 0) return { locked: 0 };
    const totalAmount = pending.reduce((s: number, a: any) => s + a.amount, 0);
    const budgetRemaining = part.campaign.budgetRemaining;
    const amountToLock = Math.min(totalAmount, budgetRemaining);
    // Lock subset if budget is insufficient
    let amountLocked = 0;
    for (const acc of pending) {
      if (amountLocked + acc.amount > amountToLock) break;
      await this.prisma.$transaction([
        this.prisma.earningAccrual.update({ where: { id: acc.id }, data: { status: 'LOCKED' } }),
        this.prisma.campaign.update({ where: { id: part.campaignId }, data: { budgetRemaining: { decrement: acc.amount } } }),
        this.prisma.ledgerEntry.create({ data: { type: 'ACCRUAL_LOCK', debitAccount: 'CampaignBudget', creditAccount: 'UserPayable', amount: acc.amount, currency: acc.currency, referenceType: 'EarningAccrual', referenceId: acc.id } }),
      ]);
      amountLocked += acc.amount;
    }
    // Auto-pause if budget depleted
    const updatedCampaign = await this.prisma.campaign.findUnique({ where: { id: part.campaignId } });
    if (updatedCampaign && updatedCampaign.budgetRemaining <= 0 && updatedCampaign.status === 'PUBLISHED') {
      await this.prisma.campaign.update({ where: { id: updatedCampaign.id }, data: { status: 'PAUSED' } });
    }
    return { locked: amountLocked };
  }
}
