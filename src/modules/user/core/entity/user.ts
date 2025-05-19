import {
  Collection,
  Embedded,
  Entity,
  EntityRepositoryType,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { UserRepository } from '@modules/user/infrastructure/repository/user.repository';
import { UserDropdownCommand, UserRegisterCommand } from '@modules/user/core/command/user.command.event';
import { UserConcreteBuilder } from '@modules/user/core/factory/user.builder';
import { Email } from '@modules/user/core/value/embeddable/email';
import { Password } from '@modules/user/core/value/embeddable/password';
import { Username } from '@modules/user/core/value/embeddable/username';
import { Phone } from '@modules/user/core/value/embeddable/phone';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Agreements } from '@modules/user/core/value/embeddable/agreements';
import { AggregateRoot } from '@nestjs/cqrs';
import { File } from '@modules/file/core/entity/file';

import day from 'dayjs';
import { Role } from '@modules/user/core/value/enum/role';
import { Profile } from '@modules/user/core/entity/profile';
import { Feed } from '@/modules/feed/core/entity/feed';

@Entity({ repository: () => UserRepository })
export class User extends AggregateRoot {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Enum({ items: () => Role, default: Role.USER, nullable: true })
  role: Role;

  @Embedded(() => Username, { prefix: false })
  username: Username;

  @Embedded(() => Email, { prefix: false })
  email: Email;

  @Embedded(() => Phone, { prefix: false, nullable: true })
  phone: Phone;

  @Embedded(() => Password, { prefix: false })
  password: Password;

  @Embedded(() => Agreements, { prefix: false })
  agreements: Agreements;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  @OneToOne(() => Profile, (profile) => profile.user, { owner: true, lazy: true })
  profile: Profile;

  @OneToMany(() => File, (file) => file.user, { nullable: true, orphanRemoval: true })
  files: Collection<File> = new Collection<File>(this);

  @OneToMany({
    entity: () => Feed,
    mappedBy: (feed) => feed.writer,
    lazy: true,
    orphanRemoval: true,
    hidden: true,
  })
  feeds = new Collection<Feed>(this);

  constructor() {
    super();
  }

  static async register(command: UserRegisterCommand): Promise<User> {
    return new UserConcreteBuilder()
      .setUsername(command.username, command.nickname)
      .setEmail(command.email)
      .setPassword(command.password)
      .setAgreements(command.agreements)
      .setTimestamp()
      .build();
  }

  async dropdown(command: { user: User }): Promise<this> {
    const timestamp = command.user.timestamp;

    command.user.timestamp = new Timestamp({
      createdAt: timestamp.createdAt,
      updatedAt: timestamp.updatedAt,
      deletedAt: day().toDate(),
    });

    command.user.apply(new UserDropdownCommand(command.user.email.value));

    return this;
  }
}
