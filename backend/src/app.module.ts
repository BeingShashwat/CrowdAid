import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmergenciesModule } from './emergencies/emergencies.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { StorageModule } from './storage/storage.module';
import { RedisModule } from './redis/redis.module';
import { AuditModule } from './audit/audit.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('rateLimit.ttl') || 60000,
          limit: config.get('rateLimit.max') || 100,
        },
      ],
    }),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Core modules
    PrismaModule,
    RedisModule,
    EmailModule,
    StorageModule,

    // Feature modules
    AuthModule,
    UsersModule,
    EmergenciesModule,
    VolunteersModule,
    NotificationsModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

