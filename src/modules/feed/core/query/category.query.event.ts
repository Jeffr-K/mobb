export class FeedCategoryQuery {
  readonly categoryUuid: string;

  constructor(data: { categoryUuid: string }) {
    this.categoryUuid = data.categoryUuid;
  }
}

export class FeedCategoriesQuery {
  readonly page: number;
  readonly offset: number;
  readonly limit: number;
  readonly orderBy: string;

  constructor(data: { page: number; offset: number; limit: number; orderBy: string }) {
    this.page = data.page;
    this.offset = data.offset;
    this.limit = data.limit;
    this.orderBy = data.orderBy;
  }
}
