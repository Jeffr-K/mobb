import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  CommentQueryEvent,
  CommentsQueryEvent,
  FeedQueryEvent,
  FeedsQueryEvent,
} from '@modules/feed/core/query/query.event';
import { Feed } from '@modules/feed/core/entity/feed';
import { FeedRepository } from '@modules/feed/infrastructure/repository/feed.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';

@QueryHandler(FeedsQueryEvent)
export class FeedsQueryEventHandler implements IQueryHandler<FeedsQueryEvent> {
  constructor(@InjectRepository(Feed) private readonly feedRepository: FeedRepository) {}

  async execute(query: FeedsQueryEvent): Promise<PaginatedResponse<Feed>> {
    return this.feedRepository.selectFeedsBy({
      page: query.page,
      size: query.size,
      sort: query.sort,
      limit: Number(query.limit),
    });
  }
}

@QueryHandler(FeedQueryEvent)
export class FeedQueryEventHandler implements IQueryHandler<FeedQueryEvent> {
  constructor(@InjectRepository(Feed) private readonly feedRepository: FeedRepository) {}
  async execute(query: FeedQueryEvent): Promise<Feed> {
    return await this.feedRepository.selectFeedBy({ uuid: query.feedId });
  }
}

@QueryHandler(CommentsQueryEvent)
export class CommentsQueryEventHandler implements IQueryHandler<CommentsQueryEvent> {
  async execute(query: CommentsQueryEvent): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
}

@QueryHandler(CommentQueryEvent)
export class CommentQueryEventHandler implements IQueryHandler<CommentQueryEvent> {
  async execute(query: CommentQueryEvent): Promise<Comment> {
    throw new Error('Method not implemented.');
  }
}
