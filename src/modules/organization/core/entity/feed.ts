import { Embedded, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Organization } from '@modules/organization/core/entity/organization';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

@Entity({ tableName: 'OrganizationFeed' })
export class Feed {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  title: string;

  @Property()
  content: string;

  @Property()
  images: string[];

  // @ManyToOne(() => Member, { fieldName: 'writer_id' })
  // writer: Member;

  @ManyToOne(() => Organization, { fieldName: 'organization_id' })
  organization: Organization;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;
}
