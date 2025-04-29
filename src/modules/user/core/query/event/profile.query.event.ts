import { User } from '@modules/user/core/entity/user';

export type ProfileSearchOptions = {
  withExperience?: boolean;
  withEducation?: boolean;
  withActivity?: boolean;
};

export class ProfileSearchQuery {
  readonly userId: number;
  readonly options?: ProfileSearchOptions;

  constructor(data: { userId: number; options?: ProfileSearchOptions }) {
    this.userId = data.userId;
    this.options = data.options;
  }
}

export class ProfilesSearchQuery {
  private readonly page: number;
  private readonly offset: number;
  private readonly limit: number;

  constructor(data: { page: number; offset: number; limit: number }) {
    this.page = data.page;
    this.offset = data.offset;
    this.limit = data.limit;
  }
}

export class ProfilePersonaSearchQuery {
  readonly user: User;

  constructor(data: { user: User }) {
    this.user = data.user;
  }
}

export class ProfileExperiencesSearchQuery {
  readonly user: User;

  constructor(data: { user: User }) {
    this.user = data.user;
  }
}

export class ProfileEducationsSearchQuery {
  readonly user: User;

  constructor(data: { user: User }) {
    this.user = data.user;
  }
}

export class ProfileActivitiesSearchQuery {
  readonly user: User;

  constructor(data: { user: User }) {
    this.user = data.user;
  }
}

export class ProfileGaragesSearchQuery {
  readonly user: User;

  constructor(data: { user: User }) {
    this.user = data.user;
  }
}

export class ProfileGarageSearchQuery {
  readonly user: User;
  readonly garageId: number;

  constructor(data: { user: User; garageId: number }) {
    this.user = data.user;
    this.garageId = data.garageId;
  }
}
