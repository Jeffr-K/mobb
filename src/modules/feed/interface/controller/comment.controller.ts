import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CommentEditCommandAdapter,
  CommentRegisterCommandAdapter,
  CommentRemoveCommandAdapter,
} from '@modules/feed/interface/adapter/adapter';
import {
  CommentEditCommandEvent,
  CommentRegisterCommandEvent,
  CommentRemoveCommandEvent,
} from '@modules/feed/core/command/command.event';
import { CommentQueryEvent, CommentsQueryEvent } from '@modules/feed/core/query/query.event';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guard/jwt.guard';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { User } from '@modules/user/core/entity/user';
import { Role } from '@modules/user/core/value/enum/role';
import { Comment } from '@modules/feed/core/entity/comment';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';

@Controller({ path: 'comment', version: ['1'] })
export class CommentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createComment(@Secured() user: User, @Body() adapter: CommentRegisterCommandAdapter): Promise<void> {
    await this.commandBus.execute(
      new CommentRegisterCommandEvent({
        writer: user,
        feedId: adapter.feedId,
        content: adapter.content,
        parentCommentId: adapter.parentCommentId,
      }),
    );
  }

  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editComment(@Param('commentId') commentId: string, @Body() adapter: CommentEditCommandAdapter) {
    await this.commandBus.execute(
      new CommentEditCommandEvent({ commentId, writerId: adapter.writerId, content: adapter.content }),
    );
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async deleteComment(@Param('commentId') commentUuid: string, @Body() adapter: CommentRemoveCommandAdapter) {
    await this.commandBus.execute(new CommentRemoveCommandEvent(commentUuid, adapter.writerUuid));
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getComments(
    @Query('feedId') feedId: string,
    @Query('page', new ValidationPipe()) page = 1,
    @Query('limit', new ValidationPipe()) limit = 10,
    @Query('orderBy') orderBy: string,
  ): Promise<PaginatedResponse<Comment>> {
    return await this.queryBus.execute(new CommentsQueryEvent({ feedId, page, limit, orderBy }));
  }

  @Get('/:commentId')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getComment(@Param('commentId') commentId: string): Promise<Comment> {
    return await this.queryBus.execute(new CommentQueryEvent({ commentId }));
  }
}
