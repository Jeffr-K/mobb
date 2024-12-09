import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from 'src/infrastructure/utils/structure/aggregate-root-id';
import { ProfileRepository } from '../../infrastructure/repository/profile.repository';

@Entity({ repository: () => ProfileRepository })
export class Profile {
  [EntityRepositoryType]?: ProfileRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
