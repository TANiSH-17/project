import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PrismaService } from './prisma.service';
import { ApplicationsModule } from './applications/applications.module';
import { ParticipantsModule } from './participants/participants.module';
import { TrackingModule } from './tracking/tracking.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { UsersModule } from './users/users.module';
import { QueuesModule } from './queues/queues.module';
import { PayoutsModule } from './payouts/payouts.module';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { JwtGuard } from './auth/jwt.guard';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, CampaignsModule, ApplicationsModule, ParticipantsModule, TrackingModule, SchedulerModule, UsersModule, QueuesModule, PayoutsModule, StripeModule, AdminModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
