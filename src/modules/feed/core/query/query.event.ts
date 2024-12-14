export class FeedsQueryEvent {
  private page: number;
  private size: number;
  private sort: string;
  private limit: string;

  constructor(event: { page: number; size: number; sort: string; limit: string }) {
    this.page = event.page;
    this.size = event.size;
    this.sort = event.sort;
    this.limit = event.limit;
  }
}

export class FeedQueryEvent {
  private feedId: string;

  constructor(event: { feedId: string }) {
    this.feedId = event.feedId;
  }
}
