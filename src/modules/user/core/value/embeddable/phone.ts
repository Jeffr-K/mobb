import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Phone {
  @Property()
  numbers: string;

  constructor(numbers: string) {
    this.numbers = numbers;
  }
}
