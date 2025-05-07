import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { Nullable } from '@infrastructure/utils/types/types';

export class CategoryCreateCommandEvent {
  readonly name: string;
  readonly parentCategoryUuid?: string | null;

  constructor(data: { name: string; parentCategoryUuid?: string | null }) {
    this.name = data.name;
    this.parentCategoryUuid = data.parentCategoryUuid ? data.parentCategoryUuid : null;
  }
}

export class CategoryEditCommandEvent {
  readonly categoryUuid: string;
  readonly name: string;
  readonly parent?: FeedCategory | null;

  constructor(data: { categoryUuid: string; name: string; parent?: Nullable<FeedCategory> }) {
    this.categoryUuid = data.categoryUuid;
    this.name = data.name;
    this.parent = data.parent ? data.parent : null;
  }
}

export class CategoryDeleteCommandEvent {
  readonly categoryUuid: string;
  readonly forceUpdate: boolean;

  constructor(data: { categoryUuid: string; forceUpdate?: boolean }) {
    this.categoryUuid = data.categoryUuid;
    this.forceUpdate = data.forceUpdate;
  }
}
