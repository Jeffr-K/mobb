import { Embedded, Entity, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

@Entity({ tableName: 'OrganizationMember' })
export class Member {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  organization: any;

  user: any;
}
