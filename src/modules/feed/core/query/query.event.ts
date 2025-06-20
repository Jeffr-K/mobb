export class FeedsQueryEvent {
  readonly page: number;
  readonly size: number;
  readonly sort: string;
  readonly limit: number;

  constructor(event: { page: number; size: number; sort: string; limit: number }) {
    this.page = event.page;
    this.size = event.size;
    this.sort = event.sort;
    this.limit = event.limit;
  }
}

export class FeedQueryEvent {
  readonly feedId: string;

  constructor(event: { feedId: string }) {
    this.feedId = event.feedId;
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
