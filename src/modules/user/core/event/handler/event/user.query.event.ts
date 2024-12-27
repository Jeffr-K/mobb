export interface GetUserByEmailQuery {
  email: string;
}

export class UserLookupEvent {
  readonly email?: string;
  readonly userId?: number;

  constructor(data: { userId?: number; email?: string }) {
    this.userId = data.userId;
    this.email = data.email;
  }
}
