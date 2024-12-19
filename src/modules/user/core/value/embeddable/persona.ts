import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Persona {
  @Property()
  cave: string;

  @Property()
  personal: string;

  @Property()
  identity: string;

  @Property()
  interests: string[];

  @Property()
  location: string;

  @Property()
  description: string;

  @Property()
  summary: string;

  constructor(data: {
    cave: string;
    personal: string;
    identity: string;
    interests: string[];
    location: string;
    description: string;
    summary: string;
  }) {
    this.cave = data.cave;
    this.personal = data.personal;
    this.identity = data.identity;
    this.interests = data.interests;
    this.location = data.location;
    this.description = data.description;
    this.summary = data.summary;
  }
}
