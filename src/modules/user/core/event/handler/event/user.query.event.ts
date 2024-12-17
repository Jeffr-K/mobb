export interface GetUserByEmailQuery {
  email: string;
}

export class UserLookupEvent {
  constructor(readonly userId: number) {}
}
