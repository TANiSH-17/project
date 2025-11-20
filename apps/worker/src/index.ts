import { Worker, QueueEvents, JobsOptions } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const redisConnection = { url: process.env.REDIS_URL || 'redis://localhost:6379' } as any;
const prisma = new PrismaClient();

async function accrueFromClicks(participationId: string) {
  const part = await prisma.participation.findUnique({ where: { id: participationId }, include: { campaign: true } });
  if (!part) return;
  const totalClicks = await prisma.click.count({ where: { participationId } });
  const accrued = await prisma.earningAccrual.aggregate({ where: { participationId, metricType: 'CLICKS' }, _sum: { value: true } });
  const done = accrued._sum.value ?? 0;
  const delta = Math.max(0, totalClicks - done);
  if (delta === 0) return;
  const amount = Math.floor((delta * part.campaign.ratePerThousand) / 1000);
  const holdDays = parseInt(process.env.HOLD_DAYS ?? '3', 10);
  const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000);
  await prisma.earningAccrual.create({ data: { participationId, metricType: 'CLICKS', value: delta, amount, currency: part.campaign.currency, status: 'PENDING', holdUntil } });
}

async function lockEligible(participationId: string) {
  const part = await prisma.participation.findUnique({ where: { id: participationId }, include: { campaign: true } });
  if (!part) return;
  const now = new Date();
  const pending = await prisma.earningAccrual.findMany({ where: { participationId, status: 'PENDING', holdUntil: { lte: now } }, orderBy: { createdAt: 'asc' } });
  let amountLocked = 0;
  for (const acc of pending) {
    if (part.campaign.budgetRemaining - amountLocked < acc.amount) break;
    await prisma.$transaction([
      prisma.earningAccrual.update({ where: { id: acc.id }, data: { status: 'LOCKED' } }),
      prisma.campaign.update({ where: { id: part.campaignId }, data: { budgetRemaining: { decrement: acc.amount } } }),
      prisma.ledgerEntry.create({ data: { type: 'ACCRUAL_LOCK', debitAccount: 'CampaignBudget', creditAccount: 'UserPayable', amount: acc.amount, currency: acc.currency, referenceType: 'EarningAccrual', referenceId: acc.id } }),
    ]);
    amountLocked += acc.amount;
  }
  const campaign = await prisma.campaign.findUnique({ where: { id: part.campaignId } });
  if (campaign && campaign.budgetRemaining <= 0 && campaign.status === 'PUBLISHED') {
    await prisma.campaign.update({ where: { id: campaign.id }, data: { status: 'PAUSED' } });
  }
}

new Worker('accrual', async job => {
  const { participationId } = job.data as { participationId: string };
  await accrueFromClicks(participationId);
  await lockEligible(participationId);
}, { connection: redisConnection });

// periodic lock sweep
new Worker('lock', async job => {
  const { participationId } = job.data as { participationId: string };
  await lockEligible(participationId);
}, { connection: redisConnection });

const events = new QueueEvents('accrual', { connection: redisConnection });
events.on('completed', ({ jobId }) => {
  console.log('accrual completed', jobId);
});
console.log('Worker started');

// Simulate view growth for VIEWS campaigns (demo only)
const SIM_INTERVAL = parseInt(process.env.SIM_INTERVAL_MS || '20000', 10);
setInterval(async () => {
  const active = await prisma.participation.findMany({ where: { status: 'ACTIVE', campaign: { metricType: 'VIEWS' } }, include: { campaign: true } , take: 25});
  const now = new Date();
  for (const p of active) {
    const inc = Math.floor(Math.random() * 200); // 0..199
    if (inc <= 0) continue;
    await prisma.metricSnapshot.create({ data: { participationId: p.id, platform: 'sim', metricType: 'VIEWS', value: inc, observedAt: now, source: 'sim', raw: {} } });
    // accrue from new views using same accrual path
    const accrued = await prisma.earningAccrual.aggregate({ where: { participationId: p.id, metricType: 'VIEWS' }, _sum: { value: true } });
    const viewsAgg = await prisma.metricSnapshot.aggregate({ where: { participationId: p.id, metricType: 'VIEWS' }, _sum: { value: true } });
    const done = accrued._sum.value ?? 0;
    const total = viewsAgg._sum.value ?? 0;
    const delta = Math.max(0, total - done);
    if (delta > 0) {
      const amount = Math.floor((delta * p.campaign.ratePerThousand) / 1000);
      const holdDays = parseInt(process.env.HOLD_DAYS ?? '3', 10);
      const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000);
      await prisma.earningAccrual.create({ data: { participationId: p.id, metricType: 'VIEWS', value: delta, amount, currency: p.campaign.currency, status: 'PENDING', holdUntil } });
    }
  }
  // attempt locking for a few participations as well
  for (const p of active.slice(0, 10)) {
    await lockEligible(p.id);
  }
}, SIM_INTERVAL);
