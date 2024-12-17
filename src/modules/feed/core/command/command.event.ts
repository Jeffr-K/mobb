import { User } from '@modules/user/core/entity/user';

export class FeedCreateCommandEvent {
  readonly title: string;
  readonly content: string;
  readonly images: string[];
  readonly user: User;

  constructor(event: { title: string; content: string; images: string[]; user: User }) {
    this.content = event.content;
    this.title = event.title;
    this.images = event.images;
    this.user = event.user;
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
  readonly feedId: string;
  readonly writer: User;
  readonly content: string;
  readonly parentCommentId?: string;

  constructor(data: {
    readonly feedId: string;
    readonly writer: User;
    readonly content: string;
    readonly parentCommentId?: string;
  }) {
    this.feedId = data.feedId;
    this.writer = data.writer;
    this.content = data.content;
    this.parentCommentId = data.parentCommentId;
  }
}

export class CommentEditCommandEvent {
  readonly commentId: string;
  readonly writerId: string;
  readonly content: string;

  constructor(data: { readonly commentId: string; readonly writerId: string; readonly content: string }) {
    this.commentId = data.commentId;
    this.writerId = data.writerId;
    this.content = data.content;
  }
}

export class CommentRemoveCommandEvent {
  constructor(readonly commentUuid: string, readonly writerUuid: string) {}
}
