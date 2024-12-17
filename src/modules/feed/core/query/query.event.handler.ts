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
import { CommentRepository } from '@modules/feed/infrastructure/repository/comment.repository';
import { Comment } from '@modules/feed/core/entity/comment';
import { NotFoundException } from '@nestjs/common';

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
    const feed = await this.feedRepository.selectFeedBy({ uuid: query.feedId });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    return feed;
  }
}

@QueryHandler(CommentsQueryEvent)
export class CommentsQueryEventHandler implements IQueryHandler<CommentsQueryEvent> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: CommentsQueryEvent): Promise<Comment[]> {
    return await this.commentRepository.selectCommentsBy({ feedId: query.feedId });
  }
}

@QueryHandler(CommentQueryEvent)
export class CommentQueryEventHandler implements IQueryHandler<CommentQueryEvent> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: CommentQueryEvent): Promise<Comment> {
    const comment = await this.commentRepository.selectCommentBy({ uuid: query.commentId });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
