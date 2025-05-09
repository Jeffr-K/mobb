import { Module } from '@nestjs/common';
import { WinstonCustomModule } from '@infrastructure/log/winston/winston.module';
import { SentryModule } from '@infrastructure/log/sentry/sentry.module';
import { ActraceModule } from './actrace/actrace.module';

@Module({
  imports: [WinstonCustomModule, SentryModule, ActraceModule],
  exports: [WinstonCustomModule, SentryModule],
})
export class LoggerModule {}
