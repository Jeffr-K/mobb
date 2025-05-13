import { Controller, Get, Post, Body, Inject, Logger, Query, Param } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { HealthService } from './health.service';
import { PerformHealthCheckCommand } from './event';
import { GetHealthStatusQuery } from './event';
import { HealthCheckCompletedEvent } from './event';
import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @RequestId()
  private readonly requestId!: string;

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly healthService: HealthService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>,
  ) {}

  @Get()
  @HealthCheck()
  async check(@Query('withContext') withContext: string = 'true'): Promise<any> {
    this.logger.log(`HealthController: Health check requested (requestId: ${this.requestId})`);

    const standardCheck = await this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);

    const checkData = { timestamp: new Date().toISOString() };

    let serviceResult: any;
    if (withContext === 'true') {
      this.logger.log(`HealthController: Calling service with context.`);
      serviceResult = await this.healthService.checkHealth(checkData);
    } else {
      this.logger.log(`HealthController: Calling service without context.`);
      serviceResult = await this.healthService.checkHealthWithoutContext(checkData);
    }

    this.logger.log(`HealthController: Health check completed.`);

    return {
      ...standardCheck,
      serviceResult,
    };
  }

  @Post('command')
  async runCommand(@Body() body: { checkType: string; params?: Record<string, any> }): Promise<any> {
    this.logger.log(`HealthController: Running command with requestId: ${this.requestId}`);

    const result = await this.commandBus.execute(new PerformHealthCheckCommand(body.checkType, body.params));

    this.logger.log(`HealthController: Command completed with requestId: ${this.requestId}`);
    return result;
  }

  // 2. Query 테스트 엔드포인트
  @Get('query')
  async runQuery(@Query('detailed') detailed: boolean = false): Promise<any> {
    this.logger.log(`HealthController: Running query with requestId: ${this.requestId}`);

    // Query 실행
    const result = await this.queryBus.execute(new GetHealthStatusQuery(detailed));

    this.logger.log(`HealthController: Query completed with requestId: ${this.requestId}`);
    return result;
  }

  // 3. Event 테스트 엔드포인트
  @Post('event')
  async publishEvent(@Body() body: { status: string }): Promise<any> {
    this.logger.log(`HealthController: Publishing event with requestId: ${this.requestId}`);

    // Event 발행
    const timestamp = new Date().toISOString();
    this.eventBus.publish(new HealthCheckCompletedEvent(body.status, timestamp, 'manual'));

    this.logger.log(`HealthController: Event published with requestId: ${this.requestId}`);
    return {
      success: true,
      message: 'Event published successfully',
      event: {
        status: body.status,
        timestamp,
        source: 'manual',
        requestId: this.requestId,
      },
    };
  }

  // 4. 전체 CQRS 흐름 테스트 엔드포인트
  @Get('cqrs-flow')
  async testCqrsFlow(): Promise<any> {
    this.logger.log(`HealthController: Starting CQRS flow test with requestId: ${this.requestId}`);

    // 1. Command 실행
    const commandResult = await this.commandBus.execute(
      new PerformHealthCheckCommand('comprehensive', { flow: 'test' }),
    );

    // 2. Query 실행
    const queryResult = await this.queryBus.execute(new GetHealthStatusQuery(true));

    // 3. Event 발행 (Service에서 이미 발행했겠지만 명시적으로 한 번 더)
    const timestamp = new Date().toISOString();
    this.eventBus.publish(new HealthCheckCompletedEvent('ok', timestamp, 'cqrs-flow'));

    this.logger.log(`HealthController: CQRS flow test completed with requestId: ${this.requestId}`);

    return {
      success: true,
      requestId: this.requestId,
      commandResult,
      queryResult,
      eventPublished: {
        status: 'ok',
        timestamp,
        source: 'cqrs-flow',
      },
    };
  }
}
