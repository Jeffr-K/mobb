import { Module } from '@nestjs/common';
import { domainModules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { FeedModule } from '@modules/feed/feed.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ...domainModules,
    ConfigModule.forRoot({
      envFilePath: `src/infrastructure/configs/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule,
    FeedModule,
    EventEmitterModule.forRoot(),
  ],
  exports: [...domainModules, ConfigModule, DatabaseModule],
})
export class AppModule {}
