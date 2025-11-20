import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../common/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @Post('seed')
  async seed(@Body() body: { campaigns?: number }) {
    const created: any = { campaigns: [], applications: [], participations: [] };
    const brandOwner = await this.prisma.user.upsert({ where: { email: 'brand@example.com' }, update: {}, create: { email: 'brand@example.com', role: 'BRAND' } });
    const brand = await this.prisma.brand.upsert({ where: { id: 'seed-brand' }, update: {}, create: { id: 'seed-brand', name: 'Seed Brand', ownerUserId: brandOwner.id, verified: true } });

    const count = body.campaigns ?? 2;
    for (let i = 0; i < count; i++) {
      const metricType = i % 2 === 0 ? 'CLICKS' : 'VIEWS';
      const campaign = await this.prisma.campaign.create({
        data: {
          brandId: brand.id,
          title: `Demo Campaign ${i+1} (${metricType})`,
          brief: 'Create content about Seed Brand!',
          budgetTotal: 1_000_000,
          budgetRemaining: 1_000_000,
          currency: 'USD',
          metricType: metricType as any,
          ratePerThousand: metricType === 'CLICKS' ? 1500 : 2000,
          status: 'PUBLISHED',
          targetUrl: 'https://example.com',
        },
      });
      created.campaigns.push(campaign);
      // one participant for each campaign
      const userEmail = `user${i+1}@example.com`;
      const user = await this.prisma.user.upsert({ where: { email: userEmail }, update: {}, create: { email: userEmail, role: 'PARTICIPANT' } });
      const app = await this.prisma.application.create({ data: { campaignId: campaign.id, userId: user.id, message: 'Let me in!' } });
      const trackingLink = 'trk_' + Math.random().toString(36).slice(2, 10);
      const participation = await this.prisma.participation.create({ data: { campaignId: campaign.id, userId: user.id, applicationId: app.id, status: 'ACTIVE', trackingLink } });
      created.applications.push(app);
      created.participations.push(participation);
    }
    return created;
  }
}
