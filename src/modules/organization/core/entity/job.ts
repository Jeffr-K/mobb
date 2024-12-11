import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { JobRepository } from '@modules/organization/infrastructure/job.repository';

@Entity({ repository: () => JobRepository })
export class Job {
  [EntityRepositoryType]?: JobRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  // title: string;
  //
  // preferences: Preferences;
  //
  // requirement: Requirement;
  //
  // writer: Member;
  //
  // organization: Organization;
  //
  // location: string;
  //
  // images: string[];
  //
  // publishedAt: Date;

  @Embedded({ prefix: false })
  timestamp: Timestamp;
}
