import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { GarageRepository } from '../../infrastructure/repository/garage.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';

@Entity({ repository: () => GarageRepository })
export class Garage {
  [EntityRepositoryType]?: GarageRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne(() => Profile)
  profile: Profile;
}
