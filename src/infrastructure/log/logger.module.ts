// logger.module.ts
import { Module } from '@nestjs/common';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { SentryModule } from '../monitor/sentry/sentry.module';
import { SentryTransport } from '@infrastructure/monitor/sentry/winston-sentry.transport';

@Module({
  imports: [
    SentryModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Persona', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
        new SentryTransport({ level: 'error' }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
