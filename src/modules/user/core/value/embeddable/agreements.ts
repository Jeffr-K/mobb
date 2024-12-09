import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Agreements {
  @Property()
  privacyPolicy: boolean;

  @Property()
  terms: boolean;

  @Property()
  notMinority: boolean;

  constructor(data: { privacyPolicy: boolean; terms: boolean; notMinority: boolean }) {
    this.privacyPolicy = data.privacyPolicy;
    this.terms = data.terms;
    this.notMinority = data.notMinority;
  }
}
