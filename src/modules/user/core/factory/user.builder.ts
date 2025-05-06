import { User } from '../entity/user';

import { Username } from '../value/embeddable/username';
import { Password } from '../value/embeddable/password';
import { Email } from '../value/embeddable/email';
import { Agreements } from '../value/embeddable/agreements';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import day from 'dayjs';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

export interface UserBuilder {
  build(): User;
}

export class UserConcreteBuilder implements UserBuilder {
  private readonly user: User;

  constructor() {
    this.user = new User();
    this.user.identifier = new AggregateRootIdentifier();
  }

  setUsername(username: string, nickname?: string): this {
    this.user.username = new Username({ username, nickname });
    return this;
  }

  setEmail(email: string): this {
    this.user.email = new Email(email);
    return this;
  }

  setPassword(password: string): this {
    this.user.password = new Password(password);
    return this;
  }

  setAgreements(agreements: Agreements): this {
    this.user.agreements = new Agreements({ ...agreements });
    return this;
  }

  setTimestamp(): this {
    this.user.timestamp = new Timestamp({
      createdAt: day().toDate(),
      updatedAt: null,
      deletedAt: null,
    });
    return this;
  }

  build(): User {
    return this.user;
  }
}
