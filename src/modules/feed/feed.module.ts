import { Module } from '@nestjs/common';
import { FeedController } from '@modules/feed/interface/controller/feed.controller';
import {
  FeedCreateCommandEventHandler,
  FeedDeleteCommandEventHandler,
  FeedEditCommandEventHandler,
} from '@modules/feed/core/command/command.event.handler';
import { FeedQueryEventHandler, FeedsQueryEventHandler } from '@modules/feed/core/query/query.event.handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Feed } from '@modules/feed/core/entity/feed';
import { CqrsModule } from '@nestjs/cqrs';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Feed, FeedEventHistory])],
  controllers: [FeedController],
  providers: [
    FeedCreateCommandEventHandler,
    FeedEditCommandEventHandler,
    FeedDeleteCommandEventHandler,
    FeedQueryEventHandler,
    FeedsQueryEventHandler,
  ],
})
export class FeedModule {}
