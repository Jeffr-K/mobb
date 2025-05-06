import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from '@infrastructure/monitor/sentry/sentry.interceptor';
import { SentryTransport } from '@infrastructure/monitor/sentry/winston-sentry.transport';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  exports: [SentryTransport, SentryInterceptor],
})
export class SentryModule {
  constructor() {
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      environment: process.env.NODE_ENV || 'development',
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0, // 트레이스 샘플링 비율 (1.0 = 100%)
      profilesSampleRate: 1.0,
    });
  }
}
