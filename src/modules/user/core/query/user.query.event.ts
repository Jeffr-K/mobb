export class UserSearchQuery {
  constructor(public readonly userId: number) {}
}

export class UsersSearchQuery {
  readonly page: number;
  readonly offset: number;
  readonly limit: number;

  constructor(data: { page: number; offset: number; limit: number }) {
    this.page = data.page;
    this.offset = data.offset;
    this.limit = data.limit;
  }
}

export class IsUserExistQueryEvent {
  constructor(public readonly email: string) {}
}
