import { Collection, Embedded, Entity, OneToMany, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Resume } from '@modules/organization/core/entity/resume';
import { Organization } from '@modules/organization/core/entity/organization';

@Entity({ tableName: 'CompanyTalentPool' })
export class Pool {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  // @OneToOne(() => Pool, pool => pool.organization, { orphanRemoval: true })
  // organization: Organization;

  @OneToMany({ entity: () => Resume, mappedBy: 'pool', orphanRemoval: true })
  resumes: Collection<Resume> = new Collection<Resume>(this);
}
