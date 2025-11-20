import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { PrismaService } from '../prisma.service';
import { ParticipantsService } from './participants.service';

@Module({
  controllers: [ParticipantsController],
  providers: [PrismaService, ParticipantsService],
})
export class ParticipantsModule {}
