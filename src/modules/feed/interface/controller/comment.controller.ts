import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

@Controller({ path: 'comment', version: ['1'] })
export class CommentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/')
  async createComment(@Body() adapter: CommentRegisterCommandAdapter): Promise<void> {
    await this.commandBus.execute(new CommentRegisterCommandEvent());
  }

  @Put('/')
  async editComment(@Body() adapter: CommentEditCommandAdapter) {
    await this.commandBus.execute(new CommentEditCommandEvent());
  }

  @Delete('/')
  async deleteComment(@Body() adapter: CommentRemoveCommandAdapter) {
    await this.commandBus.execute(new CommentRemoveCommandEvent());
  }

  @Get('/list')
  async getComments(): Promise<Comment[]> {
    return await this.queryBus.execute(new CommentsQueryEvent());
  }

  @Get('/:commentId')
  async getComment(@Param('commentId') commentId: string): Promise<Comment> {
    return await this.queryBus.execute(new CommentQueryEvent());
  }
}
