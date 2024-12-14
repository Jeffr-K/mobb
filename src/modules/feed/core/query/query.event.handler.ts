import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FeedQueryEvent, FeedsQueryEvent } from '@modules/feed/core/query/query.event';

@QueryHandler(FeedsQueryEvent)
export class FeedsQueryEventHandler implements IQueryHandler<FeedsQueryEvent> {
  async execute(query: FeedsQueryEvent): Promise<any> {
    console.log(query);
    throw new Error('Method not implemented.');
  }
}

@QueryHandler(FeedQueryEvent)
export class FeedQueryEventHandler implements IQueryHandler<FeedQueryEvent> {
  async execute(query: FeedQueryEvent): Promise<any> {
    console.log(query);
    throw new Error('Method not implemented.');
  }
}
