import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../common/auth.guard';
import { ApplyDto } from './dto/apply.dto';

@Controller()
export class ApplicationsController {
  constructor(private prisma: PrismaService) {}

  @Post('campaigns/:id/applications')
  async apply(@Param('id') campaignId: string, @Body() body: ApplyDto) {
    // Create user if missing (demo only); in real app use auth user id
    const email = body.email ?? `user-${Date.now()}@example.com`;
    const user = await this.prisma.user.upsert({
      where: { email },
      create: { email },
      update: {},
    });
    const app = await this.prisma.application.create({
      data: {
        campaignId,
        userId: user.id,
        message: body.message ?? null,
      },
    });
    return app;
  }

  @UseGuards(AuthGuard)
  @Post('applications/:id/approve')
  async approve(@Param('id') id: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    // approve and create participation with tracking link
    const updated = await this.prisma.application.update({ where: { id }, data: { status: 'APPROVED' } });
    const trackingLink = 'trk_' + Math.random().toString(36).slice(2, 10);
    const part = await this.prisma.participation.upsert({
      where: { campaignId_userId: { campaignId: app.campaignId, userId: app.userId } },
      create: {
        campaignId: app.campaignId,
        userId: app.userId,
        applicationId: app.id,
        trackingLink,
      },
      update: {},
    });
    return { application: updated, participation: part };
  }

  @Get('campaigns/:id/applications')
  async list(@Param('id') campaignId: string) {
    return this.prisma.application.findMany({ where: { campaignId }, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(AuthGuard)
  @Get('applications')
  async listAll() {
    const apps = await this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { campaign: true, user: true }
    });
    // add participation if exists
    const withPart = await Promise.all(apps.map(async (a: any) => {
      const participation = await this.prisma.participation.findUnique({ where: { campaignId_userId: { campaignId: a.campaignId, userId: a.userId } } });
      return { ...a, participation };
    }));
    return withPart;
  }
}
