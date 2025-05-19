import { v4 } from 'uuid';
import { Embeddable, Property } from '@mikro-orm/postgresql';
import { Nullable } from '@infrastructure/utils/types/types';

@Embeddable()
export class AggregateRootIdentifier {
  @Property({ type: 'uuid' })
  uuid = v4();

  @Property({ default: 1 })
  version!: number;

  constructor(data?: { uuid?: Nullable<string>; version?: Nullable<number> }) {
    if (data) {
      this.uuid = data.uuid ?? v4();
      this.version = data.version ?? 1;
    }
  }

  async increaseVersion(): Promise<AggregateRootIdentifier> {
    return new AggregateRootIdentifier({ uuid: this.uuid, version: this.version + 1 });
  }

  toJSON() {
    return {
      uuid: this.uuid,
      version: this.version,
    };
  }

  static fromJSON(data: { uuid?: string; version?: number }): AggregateRootIdentifier {
    return new AggregateRootIdentifier(data);
  }
}
