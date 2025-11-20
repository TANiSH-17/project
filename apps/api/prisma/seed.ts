import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const brandOwner = await prisma.user.upsert({ where: { email: 'brand@example.com' }, update: {}, create: { email: 'brand@example.com', role: 'BRAND' } });
  const brand = await prisma.brand.upsert({
    where: { id: 'seed-brand' },
    update: {},
    create: { id: 'seed-brand', name: 'Seed Brand', ownerUserId: brandOwner.id, verified: true },
  });
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: 'Seed Campaign',
      brief: 'Create content about Seed Brand!',
      budgetTotal: 1_000_000,
      budgetRemaining: 1_000_000,
      currency: 'USD',
      metricType: 'CLICKS',
      ratePerThousand: 1500,
      status: 'PUBLISHED',
      targetUrl: 'https://example.com',
    },
  });
  const user = await prisma.user.upsert({ where: { email: 'user@example.com' }, update: {}, create: { email: 'user@example.com', role: 'PARTICIPANT' } });
  const app = await prisma.application.create({ data: { campaignId: campaign.id, userId: user.id, message: 'Let me in!' } });
  const trackingLink = 'trk_seed_' + Math.random().toString(36).slice(2, 8);
  const participation = await prisma.participation.create({ data: { campaignId: campaign.id, userId: user.id, applicationId: app.id, status: 'ACTIVE', trackingLink } });
  console.log('Seeded campaign', campaign.id, 'participation', participation.id, 'tracking', participation.trackingLink);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
