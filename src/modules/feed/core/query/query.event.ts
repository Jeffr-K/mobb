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
  constructor() {}
}

export class CommentQueryEvent {
  constructor() {}
}
