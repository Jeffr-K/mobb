import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProfileSearchQuery, ProfilesSearchQuery } from './profile.query.event';

@QueryHandler(ProfileSearchQuery)
export class ProfileQueryEventHandler implements IQueryHandler<ProfileSearchQuery> {
  execute(query: ProfileSearchQuery): Promise<any> {
    console.log(query);
    throw new Error('Method not implemented.');
  }
}

@QueryHandler(ProfilesSearchQuery)
export class ProfilesQueryEventHandler implements IQueryHandler<ProfilesSearchQuery> {
  execute(query: ProfilesSearchQuery): Promise<any> {
    console.log(query);
    throw new Error('Method not implemented.');
  }
}
