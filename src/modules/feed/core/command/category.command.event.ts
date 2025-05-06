import { FeedCategory } from '@modules/feed/core/entity/feed-category';

export class CategoryCreateCommandEvent {
  readonly name: string;
  readonly parent?: FeedCategory | null;

  constructor(data: { name: string; parent?: FeedCategory | null }) {
    this.name = data.name;
    this.parent = data.parent ? data.parent : null;
  }
}

export class CategoryEditCommandEvent {
  readonly categoryId: string;
  readonly name: string;
  readonly parent?: FeedCategory | null;

  constructor(data: { categoryId: string; name: string; parent?: FeedCategory | null }) {
    this.categoryId = data.categoryId;
    this.name = data.name;
    this.parent = data.parent ? data.parent : null;
  }
}

export class CategoryDeleteCommandEvent {
  readonly categoryId: string;

  constructor(data: { categoryId: string }) {
    this.categoryId = data.categoryId;
  }
}
