import { Body, Controller, Post, Headers, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma.service';

@Controller('payments')
export class StripeController {
  constructor(private stripeSvc: StripeService, private prisma: PrismaService) {}

  @Post('connect/onboard')
  async onboard(@Body() body: { email: string }) {
    const user = await this.prisma.user.upsert({ where: { email: body.email }, create: { email: body.email }, update: {} });
    const { id, onboardingUrl } = await this.stripeSvc.createConnectAccount(body.email);
    await this.prisma.user.update({ where: { id: user.id }, data: { stripeAccountId: id } });
    return { onboardingUrl, stripeAccountId: id };
  }
}
