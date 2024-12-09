import { Module } from '@nestjs/common';
import { PrometheusMonitorModule } from './prometheus/prometheus.module';
import { SentryMonitorModule } from './sentry/sentry.module';

// https://docs.sentry.io/platforms/javascript/guides/nestjs/install/
@Module({
  imports: [SentryMonitorModule, PrometheusMonitorModule],
})
export class MonitorModule {}
