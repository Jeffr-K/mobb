import { Module } from '@nestjs/common';
import { WinstonCustomModule } from '@infrastructure/log/winston/winston.module';
import { SentryModule } from '@infrastructure/log/sentry/sentry.module';

@Module({
  imports: [WinstonCustomModule, SentryModule],
  exports: [WinstonCustomModule, SentryModule],
})
export class LoggerModule {}
