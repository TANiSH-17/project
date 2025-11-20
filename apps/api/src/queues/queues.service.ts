import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

function redisConfig() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  return { connection: { url } } as any;
}

@Injectable()
export class QueueService {
  accrual = new Queue('accrual', redisConfig());
  lock = new Queue('lock', redisConfig());
}
