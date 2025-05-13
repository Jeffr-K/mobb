import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import { SentryInterceptor } from '@infrastructure/log/sentry/sentry.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryTestController } from '@infrastructure/log/sentry/sentry-test.controller';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { RequestContextModule } from '../context/request-context.module';

@Module({
  imports: [ConfigModule, RequestContextModule],
  controllers: [SentryTestController],
  providers: [
    SentryInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  exports: [SentryInterceptor],
})
export class SentryModule {
  constructor(private readonly configService: ConfigService) {
    Sentry.init({
      dsn: this.configService.get<string>('SENTRY_DSN'),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      integrations: [nodeProfilingIntegration() as any, Sentry.nestIntegration()],
      tracesSampleRate: 1.0,
      profileSessionSampleRate: 1.0,
      sendDefaultPii: true,
      profileLifecycle: 'trace',
    });
  }
}
