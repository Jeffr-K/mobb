import { Embeddable, Property } from '@mikro-orm/postgresql';

@Embeddable()
export class Stack {
  @Property()
  name: string;

  @Property()
  image: string;
}

@Embeddable()
export class Tool {
  @Property()
  name: string;

  @Property()
  image: string;
}

@Embeddable()
export class Skill {
  @Property({ type: 'json', nullable: true })
  techSkills?: Stack[];

  @Property({ type: 'json', nullable: true })
  usableTools?: Tool[];

  constructor(data: { techSkills: Stack[]; usableTools: Tool[] }) {
    this.techSkills = data.techSkills;
    this.usableTools = data.usableTools;
  }

  async edit(data: { techSkills: Stack[]; usableTools: Tool[] }): Promise<Skill> {
    this.techSkills = data.techSkills;
    this.usableTools = data.usableTools;
    return this;
  }
}
