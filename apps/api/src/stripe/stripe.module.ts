import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { PrismaService } from '../prisma.service';

@Module({ providers: [StripeService, PrismaService], controllers: [StripeController] })
export class StripeModule {}
