import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { ResumeRepository } from '@modules/apply/infrastructure/repository/resume.repository';

@Entity({ repository: () => ResumeRepository })
export class Resume {
  [EntityRepositoryType]?: ResumeRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  // @Property()
  // version: number;

  // @Enum(() => ResumeStatus)
  // status: ResumeStatus;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  phone: string;

  @Property()
  address: string;

  @Property()
  sns: string[];

  @Property()
  portfolio: string;

  @Property()
  education: string;

  @Property()
  experiences: string;

  @Embedded()
  timestamp: Timestamp;

  async make(): Promise<Resume> {
    return new Resume();
  }

  // async updateResume(): Promise<void> {}

  // async save(resume: Resume): Promise<void> {}
}
