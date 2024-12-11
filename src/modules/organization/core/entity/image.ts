import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { ImageRepository } from '@modules/organization/infrastructure/image.repository';
import { Organization } from '@modules/organization/core/entity/organization';

@Entity({ repository: () => ImageRepository })
export class Image {
  [EntityRepositoryType]?: ImageRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne(() => Organization, { fieldName: 'id' })
  organization: Organization;
}
