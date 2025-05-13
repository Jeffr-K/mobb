import { Module } from '@nestjs/common';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { SentryReportTransport } from '@infrastructure/log/winston/winston-report.transport';
import { SentryModule } from '../sentry/sentry.module';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextUtils } from '@infrastructure/log/context/request-context-utils';
import { RequestContextModule } from '@infrastructure/log/context/request-context.module';
import { yellow, cyan, gray, blue, green, red, magenta } from 'colorette';
import { fixedWidthPadEnd } from '@infrastructure/utils/funcs/string-utils';

@Module({
  imports: [
    RequestContextModule,
    SentryModule,
    WinstonModule.forRootAsync({
      imports: [RequestContextModule],
      inject: [REQUEST_CONTEXT_STORAGE],
      useFactory: (asyncStorage: AsyncLocalStorage<Map<string, any>>) => {
        const requestIdFormat = winston.format((info) => {
          info.requestId = RequestContextUtils.getRequestId(asyncStorage) || 'N/A';
          return info;
        });

        const customPrintFormat = winston.format.printf(
          ({ level, message, timestamp, context, requestId, ms, ...meta }) => {
            if (process.env.NODE_ENV !== 'production') {
              const coloredLevel = (() => {
                const upperLevel = level.toUpperCase();
                switch (level) {
                  case 'error':
                    return red(upperLevel);
                  case 'warn':
                    return yellow(upperLevel);
                  case 'info':
                    return green(upperLevel);
                  case 'debug':
                    return blue(upperLevel);
                  case 'verbose':
                    return magenta(upperLevel);
                  default:
                    return upperLevel;
                }
              })();
              const levelOutput = fixedWidthPadEnd(coloredLevel, 7);

              // 컨텍스트 포맷팅 - 길이 고정
              const contextStr = context ? `[${context}]` : '';
              const coloredContext = yellow(contextStr);
              const contextOutput = fixedWidthPadEnd(coloredContext, 30);

              // 요청 ID - 전체 ID 표시
              const requestIdStr = typeof requestId === 'string' ? requestId : String(requestId || 'N/A');
              const requestIdOutput = cyan(`[${requestIdStr}]`);

              // [HealthController]와 [requestId] 사이에 공백 두 개
              const msOutput = ms ? gray(` ++${ms}`) : '';
              const timestampStr = typeof timestamp === 'string' ? timestamp : String(timestamp);

              return `${gray(timestampStr)} ${levelOutput} ${contextOutput} ${requestIdOutput} ${message}${msOutput}`;
            } else {
              const levelOutput = level.toUpperCase().padEnd(7);
              const contextStr = context ? `[${context}]` : '';
              const contextOutput = contextStr.padEnd(30);
              const requestIdStr = typeof requestId === 'string' ? requestId : String(requestId || 'N/A');
              const requestIdOutput = `[${requestIdStr}]`;
              const msOutput = ms ? ` ++${ms}` : '';

              return `${timestamp} ${levelOutput} ${contextOutput}  ${requestIdOutput} ${message} ${msOutput}`;
            }
          },
        );

        // 콘솔 출력용 포맷 조합
        const consoleFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.ms(),
          requestIdFormat(),
          customPrintFormat,
        );

        // JSON 포맷 (파일 로깅용)
        const jsonFormat = winston.format.combine(winston.format.timestamp(), requestIdFormat(), winston.format.json());

        return {
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          transports: [
            new winston.transports.Console({
              format: process.env.NODE_ENV !== 'production' ? consoleFormat : jsonFormat,
            }),
            new winston.transports.File({
              filename: 'error.log',
              level: 'error',
              format: jsonFormat,
              maxsize: 10485760,
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: 'combined.log',
              format: jsonFormat,
              maxsize: 10485760,
              maxFiles: 10,
            }),
            new SentryReportTransport({
              level: 'error',
              asyncStorage,
            }),
          ],
        };
      },
    }),
  ],
  exports: [WinstonModule],
})
export class WinstonCustomModule {}
