import { Module } from '@nestjs/common';
import { FeedController } from '@modules/feed/interface/controller/feed.controller';
import {
  CommentEditCommandEventHandler,
  CommentRegisterCommandEventHandler,
  CommentRemoveCommandEventHandler,
  FeedCreateCommandEventHandler,
  FeedDeleteCommandEventHandler,
  FeedEditCommandEventHandler,
} from '@modules/feed/core/command/comment.command.event.handler';
import {
  CommentQueryEventHandler,
  CommentsQueryEventHandler,
  FeedQueryEventHandler,
  FeedsQueryEventHandler,
} from '@modules/feed/core/query/comment.query.event.handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Feed } from '@modules/feed/core/entity/feed';
import { CqrsModule } from '@nestjs/cqrs';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CommentController } from '@modules/feed/interface/controller/comment.controller';
import { Comment } from '@modules/feed/core/entity/comment';
import { FeedCategoryController } from './interface/controller/feed-category.controller';
import {
  FeedCategoriesQueryEventHandler,
  FeedCategoryQueryEventHandler,
} from './core/query/feed-category.query.event.handler';
import {
  FeedCategoryCreateCommandEventHandler,
  FeedCategoryDeleteCommandEventHandler,
  FeedCategoryEditCommandEventHandler,
} from './core/command/category.command.event.handler';
import { FeedCategoryExceptionFilter } from './interface/advisor/category.exception-filter';
import { APP_FILTER } from '@nestjs/core';
import { FeedCategory } from './core/entity/feed-category';

export const categoryExceptionFilters = [{ provide: APP_FILTER, useClass: FeedCategoryExceptionFilter }];

@Module({
  imports: [AuthModule, CqrsModule, MikroOrmModule.forFeature([Feed, FeedEventHistory, Comment, FeedCategory])],
  controllers: [FeedController, FeedCategoryController, CommentController],
  providers: [
    JwtService,
    FeedCreateCommandEventHandler,
    FeedEditCommandEventHandler,
    FeedDeleteCommandEventHandler,
    FeedsQueryEventHandler,
    FeedQueryEventHandler,
    FeedCategoryQueryEventHandler,
    FeedCategoriesQueryEventHandler,
    FeedCategoryCreateCommandEventHandler,
    FeedCategoryDeleteCommandEventHandler,
    FeedCategoryEditCommandEventHandler,
    CommentEditCommandEventHandler,
    CommentRegisterCommandEventHandler,
    CommentRemoveCommandEventHandler,
    CommentQueryEventHandler,
    CommentsQueryEventHandler,

    ...categoryExceptionFilters,
  ],
})
export class FeedModule {}
