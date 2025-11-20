import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':email/applications')
  async applications(@Param('email') email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return [];
    return this.prisma.application.findMany({ where: { userId: user.id }, include: { campaign: true }, orderBy: { createdAt: 'desc' } });
  }

  @Get(':email/participations')
  async participations(@Param('email') email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return [];
    const parts = await this.prisma.participation.findMany({ where: { userId: user.id }, include: { campaign: true }, orderBy: { slotAssignedAt: 'desc' } });
    const enriched = await Promise.all(parts.map(async p => {
      const clicks = await this.prisma.click.count({ where: { participationId: p.id } });
      const rate = p.campaign.ratePerThousand;
      const earningsCents = Math.floor((clicks * rate) / 1000);
      return { ...p, clicks, earningsCents };
    }));
    return enriched;
  }
}
