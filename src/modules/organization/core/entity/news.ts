import { Embedded, Entity, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

@Entity({ tableName: 'OrganizationNews' })
export class News {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property({ nullable: false })
  title: string;

  @Property({ nullable: false })
  content: string;

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  // @ManyToOne()
  // organization: Organization;

  // @OneToOne()
  // writer: Member;
}
