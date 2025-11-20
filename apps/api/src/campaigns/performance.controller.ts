import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('campaigns')
export class PerformanceController {
  constructor(private prisma: PrismaService) {}

  @Get(':id/performance')
  async performance(@Param('id') id: string) {
    const locked = await this.prisma.earningAccrual.aggregate({ where: { participation: { campaignId: id }, status: 'LOCKED' }, _sum: { amount: true, value: true } });
    const spendToDate = locked._sum.amount ?? 0;
    const viewsOrClicks = locked._sum.value ?? 0;
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    const cpm = campaign && viewsOrClicks > 0 ? Math.round((spendToDate / viewsOrClicks) * 1000) : campaign?.ratePerThousand ?? 0;
    return {
      campaignId: id,
      spendToDate,
      viewsOrClicks,
      cpmEffectiveCents: cpm,
      budgetRemaining: campaign?.budgetRemaining ?? 0,
      status: campaign?.status,
    };
  }
}
