import { Nullable } from '@infrastructure/utils/types/types';

export class FeedsQueryEvent {
  readonly page: number;
  readonly size: number;
  readonly sort: string;

  readonly categoryId?: Nullable<number>;

  constructor(event: { page: number; size: number; sort: string; categoryId?: Nullable<number> }) {
    this.page = event.page;
    this.size = event.size;
    this.sort = event.sort;

    this.categoryId = event.categoryId;
  }
}

export class FeedQueryEvent {
  readonly feedId?: Nullable<string>;
  readonly categoryId?: Nullable<number>;

  constructor(event: { feedId?: Nullable<string>; categoryId?: Nullable<number> }) {
    this.feedId = event.feedId;
    this.categoryId = event.categoryId;
  }
}

export class CommentsQueryEvent {
  readonly feedId: string;
  readonly page: number;
  readonly limit: number;
  readonly orderBy: any;

  constructor(data: { feedId: string; page: number; limit: number; orderBy: string }) {
    this.feedId = data.feedId;
    this.page = data.page;
    this.limit = data.limit;
    this.orderBy = data.orderBy;
  }
}

export class CommentQueryEvent {
  readonly commentId: string;

  constructor(data: { commentId: string }) {
    this.commentId = data.commentId;
  }
}
