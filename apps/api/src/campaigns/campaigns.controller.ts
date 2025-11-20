import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../common/auth.guard';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    // minimal public fields
    const items = await this.prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        metricType: true,
        ratePerThousand: true,
        budgetRemaining: true,
        currency: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return items;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateCampaignDto) {
    // TODO: authZ (brand role), validation; for now accept minimal body
    const data = {
      title: body.title,
      brief: body.brief ?? '',
      brand: { create: { name: body.brandName ?? 'Demo Brand', owner: { create: { email: body.email ?? 'demo@example.com' } } } },
      budgetTotal: body.budgetTotal ?? 0,
      budgetRemaining: body.budgetRemaining ?? body.budgetTotal ?? 0,
      currency: body.currency ?? 'USD',
      metricType: body.metricType ?? 'VIEWS',
      ratePerThousand: body.ratePerThousand ?? 1000,
      targetUrl: body.targetUrl ?? null,
      status: 'PUBLISHED',
    } as any;
    return this.prisma.campaign.create({ data });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.campaign.update({ where: { id }, data: body });
  }
}
