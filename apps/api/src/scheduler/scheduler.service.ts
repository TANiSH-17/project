import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly log = new Logger('Scheduler');
  private timer?: NodeJS.Timer;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const intervalMs = parseInt(process.env.SCHEDULER_INTERVAL_MS ?? '60000', 10);
    this.log.log(`Starting scheduler every ${intervalMs}ms`);
    this.timer = setInterval(() => this.tick().catch(err => this.log.error(err)), intervalMs);
  }

  async tick() {
    // Find participations with recent clicks or pending accruals
    const recent = await this.prisma.participation.findMany({
      where: {
        OR: [
          { clicks: { some: { createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } } } },
          { accruals: { some: { status: 'PENDING' } } },
        ],
      },
      select: { id: true },
      take: 50,
    });
    for (const p of recent) {
      await this.accrue(p.id);
      await this.lock(p.id);
    }
  }

  async accrue(id: string) {
    const part = await this.prisma.participation.findUnique({ where: { id }, include: { campaign: true } });
    if (!part) return;
    const totalClicks = await this.prisma.click.count({ where: { participationId: id } });
    const accrued = await this.prisma.earningAccrual.aggregate({ where: { participationId: id, metricType: 'CLICKS' }, _sum: { value: true } });
    const done = accrued._sum.value ?? 0;
    const delta = Math.max(0, totalClicks - done);
    if (delta === 0) return;
    const amount = Math.floor((delta * part.campaign.ratePerThousand) / 1000);
    const holdDays = parseInt(process.env.HOLD_DAYS ?? '3', 10);
    const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000);
    await this.prisma.earningAccrual.create({ data: { participationId: id, metricType: 'CLICKS', value: delta, amount, currency: part.campaign.currency, status: 'PENDING', holdUntil } });
  }

  async lock(id: string) {
    const part = await this.prisma.participation.findUnique({ where: { id }, include: { campaign: true } });
    if (!part) return;
    const now = new Date();
    const pending = await this.prisma.earningAccrual.findMany({ where: { participationId: id, status: 'PENDING', holdUntil: { lte: now } }, orderBy: { createdAt: 'asc' } });
    let amountLocked = 0;
    for (const acc of pending) {
      if (part.campaign.budgetRemaining - amountLocked < acc.amount) break;
      await this.prisma.$transaction([
        this.prisma.earningAccrual.update({ where: { id: acc.id }, data: { status: 'LOCKED' } }),
        this.prisma.campaign.update({ where: { id: part.campaignId }, data: { budgetRemaining: { decrement: acc.amount } } }),
        this.prisma.ledgerEntry.create({ data: { type: 'ACCRUAL_LOCK', debitAccount: 'CampaignBudget', creditAccount: 'UserPayable', amount: acc.amount, currency: acc.currency, referenceType: 'EarningAccrual', referenceId: acc.id } }),
      ]);
      amountLocked += acc.amount;
    }
    const campaign = await this.prisma.campaign.findUnique({ where: { id: part.campaignId } });
    if (campaign && campaign.budgetRemaining <= 0 && campaign.status === 'PUBLISHED') {
      await this.prisma.campaign.update({ where: { id: campaign.id }, data: { status: 'PAUSED' } });
    }
  }
}
