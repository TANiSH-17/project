import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe | null;
  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = key ? new Stripe(key, { apiVersion: '2024-06-20' as any }) : null;
  }

  async createConnectAccount(email: string) {
    if (!this.stripe) return { id: 'acct_demo_' + Date.now(), onboardingUrl: 'https://dashboard.stripe.com/test/connect/accounts' };
    const account = await this.stripe.accounts.create({ type: 'express', email });
    const link = await this.stripe.accountLinks.create({ account: account.id, refresh_url: 'https://example.com/reauth', return_url: 'https://example.com/return', type: 'account_onboarding' });
    return { id: account.id, onboardingUrl: link.url };
  }
}
