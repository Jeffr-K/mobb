import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Information {
  @Property({ unique: true, nullable: false })
  name: string;

  @Property({ nullable: false })
  industry: string;

  @Property({ nullable: false })
  description: string;

  @Property({ nullable: false })
  location: string;

  constructor(data?: { name: string; industry: string; description: string; location: string }) {
    if (data) {
      this.name = data.name;
      this.industry = data.industry;
      this.description = data.description;
      this.location = data.location;
    }
  }
}
