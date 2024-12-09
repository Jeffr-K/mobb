import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Email {
  @Property()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
