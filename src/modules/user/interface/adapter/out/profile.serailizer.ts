import { Expose } from 'class-transformer';
import { Persona } from '@modules/user/core/value/embeddable/persona';
import { Experience } from '@modules/user/core/entity/experience';
import { Skill } from '@modules/user/core/value/embeddable/skill';
import { Education } from '@modules/user/core/entity/education';
import { Activity } from '@modules/user/core/entity/activity';
import { Garage } from '@modules/user/core/entity/garage';
import { User } from '@modules/user/core/entity/user';

interface Profile {
  id: string;
  avatar: string;
  persona: Persona;
  skill: Skill;
  experience: Experience[];
  education: Education[];
  activity: Activity;
  garage: Garage;
  user: User;
  createdAt: string;
  updatedAt: string;
  deleteAt: string;
}

export class ProfileSearchModelSerializer implements Profile {
  @Expose()
  id: string;

  @Expose()
  avatar: string;

  @Expose()
  persona: Persona;

  @Expose()
  skill: Skill;

  @Expose()
  experience: Experience[];

  @Expose()
  education: Education[];

  @Expose()
  activity: Activity;

  @Expose()
  garage: Garage;

  @Expose()
  user: User;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  deleteAt: string;
}
