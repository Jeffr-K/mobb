import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextUtils } from '@infrastructure/log/context/request-context-utils';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly controllerName = 'HealthController'; // 컨트롤러 이름 저장

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: any,
    @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const requestId = RequestContextUtils.getRequestId(this.asyncStorage);

    // 기본 NestJS 로거로 로그 남기기
    this.logger.log(`Health check requested (requestId: ${requestId || 'no-request-id'})`);

    // Winston 로거로 로그 남기기 - 모든 로그에 컨텍스트 정보 추가
    this.winstonLogger.info('Health check using winston logger', { context: this.controllerName });
    this.winstonLogger.debug('Debug level log from health controller', { context: this.controllerName });
    this.winstonLogger.warn('Warning level log from health controller', { context: this.controllerName });

    // 요청 처리 및 결과 반환
    const result = await this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')
    ]);

    // 결과 로깅 - 컨텍스트 정보 추가
    this.winstonLogger.info('Health check completed', { context: this.controllerName, result });

    return result;
  }
}