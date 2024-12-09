import { Embeddable, Property } from '@mikro-orm/core';
import day from 'dayjs';

@Embeddable()
export class Timestamp {
  @Property({ nullable: false })
  createdAt: Date = day().toDate();

  @Property({ nullable: true })
  updatedAt?: Date = null;

  @Property({ nullable: true })
  deletedAt?: Date = null;

  constructor(data: { createdAt: Date; updatedAt?: Date; deletedAt?: Date }) {
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
