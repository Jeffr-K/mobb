import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller({ path: 'comment', version: ['1'] })
export class CommentController {
  constructor() {}

  @Post()
  async createComment() {
    // implementation
  }

  @Put()
  async updateComment() {
    // implementation
  }

  @Delete()
  async deleteComment() {
    // implementation
  }

  @Get('/list')
  async getComments() {
    // implementation
  }

  @Get('/list')
  async getComment() {
    // implementation
  }
}
