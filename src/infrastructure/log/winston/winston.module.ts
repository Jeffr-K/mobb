import { Module } from '@nestjs/common';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { SentryTransport } from '@infrastructure/log/sentry/winston-sentry.transport';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => {
        return {
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          transports: [
            process.env.NODE_ENV !== 'production'
              ? new winston.transports.Console({
                  format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    nestWinstonModuleUtilities.format.nestLike('Persona', {
                      prettyPrint: true,
                      colors: true,
                    }),
                  ),
                })
              : new winston.transports.Console({
                  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
            new winston.transports.File({
              filename: 'error.log',
              level: 'error',
              format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              maxsize: 10485760,
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: 'combined.log',
              format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
              maxsize: 10485760, // 10MB
              maxFiles: 10,
            }),
            new SentryTransport({ level: 'error' }),
          ],
        };
      },
    }),
  ],
  exports: [WinstonModule],
})
export class WinstonCustomModule {}
