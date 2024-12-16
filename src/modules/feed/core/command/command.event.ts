export class FeedCreateCommandEvent {
  readonly title: string;
  readonly content: string;
  readonly images: string[];

  constructor(event: { title: string; content: string; images: string[] }) {
    this.content = event.content;
    this.title = event.title;
    this.images = event.images;
  }
}

export class FeedDeleteCommandEvent {
  readonly feedId: string;

  constructor(event: { feedId: string }) {
    this.feedId = event.feedId;
  }
}

export class FeedEditCommandEvent {
  readonly feedId: string;
  readonly title: string;
  readonly content?: string;
  readonly images?: string[];

  constructor(event: { feedId: string; title: string; content?: string; images?: string[] }) {
    this.feedId = event.feedId;
    this.content = event.content ? event.content : null;
    this.title = event.title;
    this.images = event.images ? event.images : null;
  }
}

export class CommentRegisterCommandEvent {
  constructor() {}
}

export class CommentEditCommandEvent {
  constructor() {}
}

export class CommentRemoveCommandEvent {
  constructor() {}
}
