import { User } from '@modules/user/core/entity/user';

export class UserReIssueSessionCommand {
  readonly user: User
  constructor(data: { user: User }) {
    this.user = data.user;
  }
}