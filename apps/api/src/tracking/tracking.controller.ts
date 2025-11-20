import { Controller, Get, Headers, Ip, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { QueueService } from '../queues/queues.service';

@Controller('t')
export class TrackingController {
  constructor(private prisma: PrismaService, private queues: QueueService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Ip() ip: string, @Headers('user-agent') ua: string, @Res() res: Response) {
    const participation = await this.prisma.participation.findFirst({ where: { trackingLink: code }, include: { campaign: true } });
    if (!participation) throw new NotFoundException('Invalid code');
    // simple dedupe: ignore if same IP and UA clicked in last 30s for this participation
    const thirtySecAgo = new Date(Date.now() - 30 * 1000);
    const recent = await this.prisma.click.findFirst({ where: { participationId: participation.id, ip: ip ?? undefined, userAgent: ua ?? undefined, createdAt: { gte: thirtySecAgo } } });
    if (!recent) {
      await this.prisma.click.create({ data: { participationId: participation.id, ip: ip ?? null, userAgent: ua ?? null } });
      // enqueue accrual for this participation
      await this.queues.accrual.add('accrue', { participationId: participation.id }, { removeOnComplete: 100, removeOnFail: 100 });
    }
    // enqueue accrual for this participation
    await this.queues.accrual.add('accrue', { participationId: participation.id }, { removeOnComplete: 100, removeOnFail: 100 });
    const target = participation.campaign.targetUrl || `${process.env.WEB_ORIGIN ?? 'http://localhost:3000'}/campaigns/${participation.campaignId}`;
    return res.redirect(302, target);
  }
}
