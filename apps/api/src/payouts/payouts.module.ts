import { Module } from '@nestjs/common';
import { PayoutsController } from './payouts.controller';
import { PrismaService } from '../prisma.service';

@Module({ controllers: [PayoutsController], providers: [PrismaService] })
export class PayoutsModule {}
