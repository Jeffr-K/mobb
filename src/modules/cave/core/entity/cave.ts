import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Founder } from '@modules/cave/core/value/founder';
import { Participant } from '@modules/cave/core/value/participant';
import { Tag } from '@modules/cave/core/value/tag';
import { Category } from '@modules/cave/core/value/category';
import { Notification } from '@modules/cave/core/value/notification';
import { CaveRepository } from '@modules/cave/repository/cave.repository';

@Entity({ repository: () => CaveRepository })
export class Cave {
  [EntityRepositoryType]?: CaveRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  category: Category;

  name: string;

  founder: Founder;

  participant: Participant;

  notification: Notification[];

  tags: Tag[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
