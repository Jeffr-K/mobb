import { GetUserByEmailQuery } from '../../../user/core/event/handler/event/user.query.event';

export class GetUserByEmailQueryEvent implements GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}
