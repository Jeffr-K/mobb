import { Module } from '@nestjs/common';
import { PrometheusMonitorModule } from './prometheus/prometheus.module';
import { SentryModule } from './sentry/sentry.module';

// https://docs.sentry.io/platforms/javascript/guides/nestjs/install/
@Module({
  imports: [SentryModule, PrometheusMonitorModule],
})
export class MonitorModule {}
