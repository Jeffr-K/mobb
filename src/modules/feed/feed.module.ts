import { Module } from '@nestjs/common';
import { FeedController } from '@modules/feed/interface/controller/feed.controller';
import {
  CommentEditCommandEventHandler,
  CommentRegisterCommandEventHandler,
  CommentRemoveCommandEventHandler,
  FeedCreateCommandEventHandler,
  FeedDeleteCommandEventHandler,
  FeedEditCommandEventHandler,
} from '@modules/feed/core/command/command.event.handler';
import {
  CommentQueryEventHandler,
  CommentsQueryEventHandler,
  FeedQueryEventHandler,
  FeedsQueryEventHandler,
} from '@modules/feed/core/query/query.event.handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Feed } from '@modules/feed/core/entity/feed';
import { CqrsModule } from '@nestjs/cqrs';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { CommentController } from '@modules/feed/interface/controller/comment.controller';
import { Comment } from '@modules/feed/core/entity/comment';

@Module({
  imports: [AuthModule, CqrsModule, MikroOrmModule.forFeature([Feed, FeedEventHistory, Comment])],
  controllers: [FeedController, CommentController],
  providers: [
    JwtAuthGuard,
    JwtService,
    FeedCreateCommandEventHandler,
    FeedEditCommandEventHandler,
    FeedDeleteCommandEventHandler,
    FeedsQueryEventHandler,
    FeedQueryEventHandler,
    CommentEditCommandEventHandler,
    CommentRegisterCommandEventHandler,
    CommentRemoveCommandEventHandler,
    CommentQueryEventHandler,
    CommentsQueryEventHandler,
  ],
})
export class FeedModule {}
