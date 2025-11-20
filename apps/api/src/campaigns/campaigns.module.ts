import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { PrismaService } from '../prisma.service';
import { PerformanceController } from './performance.controller';

@Module({
  controllers: [CampaignsController, PerformanceController],
  providers: [PrismaService],
})
export class CampaignsModule {}
