export class FileQueryEventBy {
  readonly feedIds: Array<number>;

  constructor(data: { feedIds: Array<number> }) {
    this.feedIds = data.feedIds;
  }
}
