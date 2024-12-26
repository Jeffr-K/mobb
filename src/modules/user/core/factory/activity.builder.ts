import { Activity } from '@modules/user/core/entity/activity';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import day from 'dayjs';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

interface ActivityBuilder {
  build(): Activity;
}

export class ActivityConcreteBuilder implements ActivityBuilder {
  private readonly activity: Activity;

  constructor() {
    this.activity = new Activity();
    this.activity.identifier = new AggregateRootIdentifier();
  }

  setProfile(profile: any): this {
    this.activity.profile = profile;
    return this;
  }

  setTitle(title: string): this {
    this.activity.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.activity.description = description;
    return this;
  }

  setPeriod(period: string[]): this {
    this.activity.period = period;
    return this;
  }

  setRole(role: string): this {
    this.activity.role = role;
    return this;
  }

  setTeam(team: string): this {
    this.activity.team = team;
    return this;
  }

  setLocation(location: string): this {
    this.activity.location = location;
    return this;
  }

  setIsPublic(isPublic: boolean): this {
    this.activity.isPublic = isPublic;
    return this;
  }

  setTimestamp(): this {
    this.activity.timestamp = new Timestamp({
      createdAt: day().toDate(),
      updatedAt: null,
      deletedAt: null,
    });
    return this;
  }

  build(): Activity {
    return this.activity;
  }
}
