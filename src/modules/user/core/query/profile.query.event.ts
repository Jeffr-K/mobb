export class ProfileSearchQuery {
  private readonly id: number;

  constructor(data: { id: number }) {
    this.id = data.id;
  }
}

export class ProfilesSearchQuery {
  private readonly page: number;
  private readonly offset: number;
  private readonly limit: number;

  constructor(data: { page: number; offset: number; limit: number }) {
    this.page = data.page;
    this.offset = data.offset;
    this.limit = data.limit;
  }
}
