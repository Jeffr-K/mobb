import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@infrastructure/health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { HealthService } from '@infrastructure/health/health.service';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthCheckCompletedEventHandler } from '@infrastructure/health/health.event-bus.handler';
import { GetHealthStatusQueryHandler } from '@infrastructure/health/health.query.handler';
import { PerformHealthCheckCommandHandler } from '@infrastructure/health/health.command.handler';

@Module({
  imports: [TerminusModule, HttpModule, CqrsModule],
  controllers: [HealthController],
  providers: [
    HealthService,
    PerformHealthCheckCommandHandler,
    HealthCheckCompletedEventHandler,
    GetHealthStatusQueryHandler,
  ],
})
export class HealthModule {}
