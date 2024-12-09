import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { ExtendsAggregateRoot } from 'src/infrastructure/utils/structure/extends-aggregate-root';

@Entity()
export class Permission extends ExtendsAggregateRoot {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;
}
