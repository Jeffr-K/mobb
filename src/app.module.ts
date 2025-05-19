import { Module } from '@nestjs/common';
import { domainModules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from '@infrastructure/log/logger.module';
// import { HealthModule } from '@infrastructure/health/health.module';

@Module({
  imports: [
    ...domainModules,
    ConfigModule.forRoot({
      envFilePath: `src/infrastructure/configs/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    LoggerModule,
    // HealthModule,
  ],
  exports: [...domainModules, ConfigModule, DatabaseModule],
})
export class AppModule {}
