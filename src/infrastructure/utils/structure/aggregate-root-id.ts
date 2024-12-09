import { v4 } from 'uuid';
import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class AggregateRootIdentifier {
  @Property({ type: 'uuid' })
  uuid = v4();

  @Property({ default: 1 })
  version!: number;
}
