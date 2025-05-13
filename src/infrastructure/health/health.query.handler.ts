import { QueryHandler, IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TraceAsyncRequest } from '@infrastructure/log/context/decorators/with-request-context.decorator';
import { HealthService } from './health.service';
import { GetHealthStatusQuery, OtherEvent } from './event';
import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';

@QueryHandler(GetHealthStatusQuery)
export class GetHealthStatusQueryHandler implements IQueryHandler<GetHealthStatusQuery> {
  private readonly logger = new Logger(GetHealthStatusQueryHandler.name);

  @RequestId() private readonly requestId!: string;

  constructor(
    private readonly healthService: HealthService,
    private readonly queryBus: QueryBus,
    @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>,
  ) {}

  @TraceAsyncRequest()
  async execute(query: GetHealthStatusQuery): Promise<any> {
    this.logger.log(`QueryHandler: Executing health status query with requestId: ${this.requestId}`);

    const result = await this.healthService.checkHealth({
      source: 'query',
      detailed: query.detailed,
    });

    this.logger.log(`QueryHandler: Health status query completed with requestId: ${this.requestId}`);

    const other = await this.queryBus.execute(new OtherEvent({ name: '윤정기 ㅂㅅ' }));
    this.logger.log(`QueryHandler: Other event executed with requestId: ${this.requestId}`);

    return { ...result, other };
  }
}
