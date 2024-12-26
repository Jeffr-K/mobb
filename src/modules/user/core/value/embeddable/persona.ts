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

  constructor(persona: {
    cave: string;
    personal: string;
    identity: string;
    interests: string[];
    location: string;
    description: string;
    summary: string;
  }) {
    this.cave = persona.cave;
    this.personal = persona.personal;
    this.identity = persona.identity;
    this.interests = persona.interests;
    this.location = persona.location;
    this.description = persona.description;
    this.summary = persona.summary;
  }

  async edit(persona: {
    cave: string;
    personal: string;
    identity: string;
    interests: string[];
    location: string;
    description: string;
    summary: string;
  }): Promise<Persona> {
    // TODO: validation logic 추가
    this.cave = persona.cave;
    this.personal = persona.personal;
    this.identity = persona.identity;
    this.interests = persona.interests;
    this.location = persona.location;
    this.description = persona.description;
    this.summary = persona.summary;

    console.log('persona', this);
    return this;
  }
}
