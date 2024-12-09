import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ExtendsAggregateRoot } from 'src/infrastructure/utils/structure/extends-aggregate-root';

@Entity()
export class Role extends ExtendsAggregateRoot {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;
}
