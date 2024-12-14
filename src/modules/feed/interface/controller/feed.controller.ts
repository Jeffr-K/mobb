import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Feed } from '@modules/feed/core/entity/feed';
import { FeedCreateAdapter, FeedDeleteParamAdapter, FeedEditAdapter } from '@modules/feed/interface/adapter/adapter';
import {
  FeedCreateCommandEvent,
  FeedDeleteCommandEvent,
  FeedEditCommandEvent,
} from '@modules/feed/core/command/command.event';
import { FeedQueryEvent, FeedsQueryEvent } from '@modules/feed/core/query/query.event';

@Controller({ path: 'feed', version: ['1'] })
export class FeedController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post('/')
  async createFeed(@Body() adapter: FeedCreateAdapter): Promise<void> {
    await this.commandBus.execute(new FeedCreateCommandEvent({ ...adapter }));
  }

  @Delete('/:feedId')
  async deleteFeed(@Param() param: FeedDeleteParamAdapter): Promise<void> {
    await this.commandBus.execute(new FeedDeleteCommandEvent({ ...param }));
  }

  @Put('/:feedId')
  async editFeed(@Param('feedId') feedId: string, @Body() adapter: FeedEditAdapter): Promise<void> {
    await this.commandBus.execute(new FeedEditCommandEvent({
        feedId: feedId,
        title: adapter.title,
        content: adapter.content,
        images: adapter.images,
      }),
    );
  }

  @Get('/list')
  async feeds(
    @Param('feedId') feedId: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: string,
    @Query('limit') limit: string,
  ): Promise<Feed[]> {
    return await this.queryBus.execute(new FeedsQueryEvent({ page, size, sort, limit }));
  }

  @Get('/:feedId')
  async feed(@Param('feedId') feedId: string): Promise<Feed> {
    return await this.queryBus.execute(new FeedQueryEvent({ feedId }));
  }
}
