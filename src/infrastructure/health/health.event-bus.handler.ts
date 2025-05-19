// import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { Inject, Logger } from '@nestjs/common';
// import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
// import { AsyncLocalStorage } from 'node:async_hooks';
// import { TraceAsyncRequest } from '@infrastructure/log/context/decorators/with-request-context.decorator';
// import { HealthCheckCompletedEvent } from '@infrastructure/health/event';
// import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';
//
// @EventsHandler(HealthCheckCompletedEvent)
// export class HealthCheckCompletedEventHandler implements IEventHandler<HealthCheckCompletedEvent> {
//   private readonly logger = new Logger(HealthCheckCompletedEventHandler.name);
//
//   @RequestId() private readonly requestId: string;
//
//   constructor(@Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>) {}
//
//   // 인터페이스 시그니처를 준수하면서도 컨텍스트 유지
//   @TraceAsyncRequest({
//     logEntryExit: true,
//     propagateToCommandQuery: true,
//   })
//   async handle(event: HealthCheckCompletedEvent): Promise<void> {
//     this.logger.log(`EventHandler: Handling event with requestId: ${this.requestId}`);
//     this.logger.log(
//       `EventHandler: Health check from ${event.source} completed at ${event.timestamp} with status: ${event.status}`,
//     );
//     await new Promise((resolve) => setTimeout(resolve, 50));
//
//     this.logger.log(`EventHandler: Event processing completed with requestId: ${this.requestId}`);
//   }
// }
