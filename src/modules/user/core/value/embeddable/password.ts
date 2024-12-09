import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Password {
  @Property()
  password: string;

  constructor(password: string) {
    this.password = password;
  }
}
