import { Module } from '@nestjs/common';
import { QueueService } from './queues.service';

@Module({ providers: [QueueService], exports: [QueueService] })
export class QueuesModule {}
