import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Username {
  @Property()
  username: string;

  @Property()
  nickname: string;

  constructor(data: { username: string; nickname: string }) {
    this.username = data.username;
    this.nickname = data.nickname;
  }

  get Username(): string {
    return this.username;
  }

  get Nickname(): string {
    return this.nickname;
  }
}
