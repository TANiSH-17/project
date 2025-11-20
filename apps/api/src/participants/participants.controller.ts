import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ParticipantsService } from './participants.service';
import { AuthGuard } from '../common/auth.guard';
import { SubmitDto } from './dto/submit.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private prisma: PrismaService, private service: ParticipantsService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const part = await this.prisma.participation.findUnique({ where: { id } });
    if (!part) throw new NotFoundException('Not found');
    return part;
  }

  @Get(':id/metrics')
  async metrics(@Param('id') id: string) {
    const part = await this.prisma.participation.findUnique({ where: { id }, include: { campaign: true } });
    if (!part) throw new NotFoundException('Not found');
    const rate = part.campaign.ratePerThousand;
    if (part.campaign.metricType === 'CLICKS') {
      const clicks = await this.prisma.click.count({ where: { participationId: id } });
      const earnings = Math.floor((clicks * rate) / 1000);
      return { metricType: 'CLICKS', clicks, ratePerThousand: rate, currency: part.campaign.currency, earningsCents: earnings };
    } else {
      const totalViewsAgg = await this.prisma.metricSnapshot.aggregate({ where: { participationId: id, metricType: 'VIEWS' }, _sum: { value: true } });
      const views = totalViewsAgg._sum.value ?? 0;
      const earnings = Math.floor((views * rate) / 1000);
      return { metricType: 'VIEWS', views, ratePerThousand: rate, currency: part.campaign.currency, earningsCents: earnings };
    }
  }

  @Post(':id/submissions')
  async submit(@Param('id') id: string, @Body() body: SubmitDto) {
    const part = await this.prisma.participation.findUnique({ where: { id } });
    if (!part) throw new NotFoundException('Participation not found');
    const sub = await this.prisma.contentSubmission.create({
      data: {
        participationId: id,
        platform: body.platform ?? 'youtube',
        postUrl: body.postUrl,
        postId: body.postId ?? null,
        notes: body.notes ?? null,
      },
    });
    return sub;
  }

  @UseGuards(AuthGuard)
  @Post(':id/accrue')
  async accrue(@Param('id') id: string) {
    return this.service.accrueFromClicks(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/lock')
  async lock(@Param('id') id: string) {
    return this.service.lockEligible(id);
  }
}
