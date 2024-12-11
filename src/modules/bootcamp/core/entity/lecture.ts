import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Instructor } from '@modules/bootcamp/core/value/instructor';
import { LectureRepository } from '@modules/bootcamp/infrastructure/repository/lecture.repository';
import { Environment } from '@modules/bootcamp/core/value/environment';

@Entity({ repository: () => LectureRepository })
export class Lecture {
  [EntityRepositoryType]?: LectureRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  environment: Environment;

  title: string;

  description: string;

  summary: string;

  instructor: Instructor;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
