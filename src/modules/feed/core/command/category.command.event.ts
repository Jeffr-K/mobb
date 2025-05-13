import { Nullable } from '@infrastructure/utils/types/types';

export class CategoryCreateCommandEvent {
  readonly name: string;
  readonly parentCategoryUuid?: Nullable<string>;

  constructor(data: { name: string; parentCategoryUuid?: Nullable<string> }) {
    this.name = data.name;
    this.parentCategoryUuid = data.parentCategoryUuid ? data.parentCategoryUuid : null;
  }
}

export class CategoryEditCommandEvent {
  readonly categoryUuid: string;
  readonly name: string;
  readonly parentCategoryUuid?: Nullable<string>;

  constructor(data: { categoryUuid: string; name: string; parentCategoryUuid: Nullable<string> }) {
    this.categoryUuid = data.categoryUuid;
    this.name = data.name;
    this.parentCategoryUuid = data.parentCategoryUuid ? data.parentCategoryUuid : null;
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
