// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { OtherEvent } from '@infrastructure/health/event';
// import { AsyncLocalStorage } from 'node:async_hooks';
// import { Inject, Logger } from '@nestjs/common';
// import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
// import { TraceAsyncRequest } from '@infrastructure/log/context/decorators/with-request-context.decorator';
// import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';
//
// @QueryHandler(OtherEvent)
// export class HealthCheckOtherQueryEventHandler implements IQueryHandler<OtherEvent> {
//   private readonly logger = new Logger(HealthCheckOtherQueryEventHandler.name);
//   @RequestId() private readonly requestId: string;
//
//   constructor(@Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>) {}
//
//   @TraceAsyncRequest()
//   async execute(query: OtherEvent): Promise<any> {
//     this.logger.log(`Executing OtherEvent with name: ${this.requestId}`);
//     this.logger.log(`=============나는 병신이다===============`);
//     return query;
//   }
// }
