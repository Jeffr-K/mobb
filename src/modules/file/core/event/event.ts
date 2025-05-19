import { Feed } from '@/modules/feed/core/entity/feed';
import { FeedImage } from '@/modules/feed/interface/adapter/adapter';

export class FileUpdateCommand {
  readonly images: FeedImage[];
  readonly feed: Feed;

  constructor(data: { images: Array<FeedImage>; feed: Feed }) {
    this.images = data.images;
    this.feed = data.feed;
  }
}
