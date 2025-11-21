import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../common/auth.guard';

@Controller('payouts')
export class PayoutsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('email') email?: string) {
    if (email) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) return [];
      return this.prisma.payout.findMany({ where: { userId: user.id }, orderBy: { initiatedAt: 'desc' } });
    }
    return this.prisma.payout.findMany({ orderBy: { initiatedAt: 'desc' }, take: 100 });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: { email: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new Error('User not found');
    // Sum locked accruals into a payout and mark them paid
    const locked = await this.prisma.earningAccrual.findMany({ where: { participation: { userId: user.id }, status: 'LOCKED' } });
    const amount = locked.reduce((s: number, a: any) => s + a.amount, 0);
    if (amount <= 0) return { ok: false, reason: 'no_locked' };
    const currency = locked[0]?.currency || 'USD';
    const payout = await this.prisma.payout.create({ data: { userId: user.id, amount, currency, status: 'completed', initiatedAt: new Date(), completedAt: new Date(), processorRef: 'demo_' + Date.now() } });
    for (const acc of locked) {
      await this.prisma.$transaction([
        this.prisma.earningAccrual.update({ where: { id: acc.id }, data: { status: 'PAID' } }),
        this.prisma.ledgerEntry.create({ data: { type: 'PAYOUT', debitAccount: 'UserPayable', creditAccount: 'Cash', amount: acc.amount, currency, referenceType: 'Payout', referenceId: payout.id } }),
      ]);
    }
    return payout;
  }
}
