export class FeedCategoryQuery {
  readonly categoryUuid: string;
  constructor(data: { categoryUuid: string }) {
    this.categoryUuid = data.categoryUuid;
  }
}
