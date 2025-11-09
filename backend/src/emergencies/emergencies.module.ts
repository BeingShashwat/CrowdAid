import { Module } from '@nestjs/common';
import { EmergenciesController } from './emergencies.controller';
import { EmergenciesService } from './emergencies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [EmergenciesController],
  providers: [EmergenciesService],
  exports: [EmergenciesService],
})
export class EmergenciesModule {}

