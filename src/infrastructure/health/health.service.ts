// import { Injectable, Inject, Logger } from '@nestjs/common';
// import { EventBus } from '@nestjs/cqrs';
// import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
// import { AsyncLocalStorage } from 'node:async_hooks';
// import { TraceAsyncRequest } from '@infrastructure/log/context/decorators/with-request-context.decorator';
// import { HealthCheckCompletedEvent } from './event';
// import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';
//
// @Injectable()
// export class HealthService {
//   private readonly logger = new Logger(HealthService.name);
//
//   @RequestId()
//   private readonly requestId!: string;
//
//   constructor(
//     @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>,
//     private readonly eventBus: EventBus,
//   ) {}
//
//   @TraceAsyncRequest()
//   async checkHealth(checkData: any): Promise<any> {
//     this.logger.log(`HealthService: Processing health check with requestId: ${this.requestId}`);
//
//     // 약간의 지연 추가 (비동기 작업 시뮬레이션)
//     await new Promise((resolve) => setTimeout(resolve, 100));
//
//     const timestamp = new Date().toISOString();
//     const result = {
//       status: 'ok',
//       timestamp,
//       requestId: this.requestId,
//       checkData,
//     };
//
//     // 이벤트 발행 - 요청 ID 가 자동으로 전파됨
//     this.eventBus.publish(new HealthCheckCompletedEvent('ok', timestamp, checkData.source || 'direct'));
//
//     this.logger.log(`HealthService: Health check completed with requestId: ${this.requestId}`);
//     return result;
//   }
//
//   // 컨텍스트를 사용하지 않는 메서드 (비교용)
//   async checkHealthWithoutContext(checkData: any): Promise<any> {
//     // asyncStorage에서 직접 요청 ID 가져오기 시도
//     const requestId = this.asyncStorage.getStore()?.get('requestId');
//
//     this.logger.log(
//       `HealthService (no context): Processing health check with requestId: ${requestId || 'not available'}`,
//     );
//
//     // 약간의 지연 추가 (비동기 작업 시뮬레이션)
//     await new Promise((resolve) => setTimeout(resolve, 100));
//
//     this.logger.log(
//       `HealthService (no context): Health check completed with requestId: ${requestId || 'not available'}`,
//     );
//
//     return {
//       status: 'ok',
//       timestamp: new Date().toISOString(),
//       requestId: requestId || 'not available',
//       checkData,
//     };
//   }
// }
