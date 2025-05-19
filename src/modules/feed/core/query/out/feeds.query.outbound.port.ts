import { PaginatedResponse } from '@/infrastructure/utils/base/base-response';
import { AggregateRootIdentifier } from '@/infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@/modules/user/core/entity/profile';
import { User } from '@/modules/user/core/entity/user';
import { Feed } from '../../entity/feed';
import { FeedCategory } from '../../entity/feed-category';
import { File } from '@/modules/file/core/entity/file';

export interface FeedQueryResponse {
  _id: number;
  identifier: AggregateRootIdentifier;
  category: FeedCategory;
  profile: Profile;
  author: User;
  content: string;
  view: number;
  likes: number;
  comments: number;
  createdAt: Date;
  share: number;
  images: File[];
}

export interface FeedQueryEventOutBoundPort {
  mapTo(feeds: PaginatedResponse<Feed>): Promise<PaginatedResponse<FeedQueryResponse>>;
}

export class FeedQueryEventOutBoundAdapter implements FeedQueryEventOutBoundPort {
  async mapTo(feeds: PaginatedResponse<Feed>): Promise<PaginatedResponse<FeedQueryResponse>> {
    const mappedItems = feeds.items.map((feed) => {
      return {
        _id: feed._id,
        identifier: feed.identifier,
        category: feed.category,
        profile: feed.writer?.profile,
        author: feed.writer,
        content: feed.content,
        view: 0,
        likes: 0,
        comments: 0,
        createdAt: feed.timestamp?.createdAt,
        share: 0,
        images: feed.files?.getItems?.() || [],
      } as FeedQueryResponse;
    });

    return {
      ...feeds,
      items: mappedItems,
    };
  }
}
