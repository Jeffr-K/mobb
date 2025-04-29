// import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
// import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import {
//   ResumeDeleteCommandAdapter,
//   ResumeEditCommandAdapter,
//   ResumeRegisterCommandAdapter,
// } from '@modules/user/interface/adapter/in/resume.command.adapter';
// import {
//   ResumeDeleteCommand,
//   ResumeEditCommand,
//   ResumeRegisterCommand,
// } from '@modules/user/core/command/resume.command.event';
// import { ResumeQueryEvent, ResumesQueryEvent } from '@modules/user/core/query/resume.query.event';
// import { Resume } from '@modules/user/core/entity/resume';
//
// @Controller({ path: 'resume', version: ['1'] })
// export class ResumeController {
//   constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
//
//   @Post('/')
//   async createResume(@Body() adapter: ResumeRegisterCommandAdapter): Promise<void> {
//     await this.commandBus.execute(new ResumeRegisterCommand());
//   }
//
//   @Delete('/')
//   async deleteResume(@Body() adapter: ResumeDeleteCommandAdapter): Promise<void> {
//     await this.commandBus.execute(new ResumeDeleteCommand());
//   }
//
//   @Put('/')
//   async editResume(@Body() adapter: ResumeEditCommandAdapter): Promise<void> {
//     await this.commandBus.execute(new ResumeEditCommand());
//   }
//
//   @Get('/list')
//   async getResumes(): Promise<Resume[]> {
//     return this.queryBus.execute(new ResumesQueryEvent());
//   }
//
//   @Get('/')
//   async getResume(): Promise<Resume> {
//     return this.queryBus.execute(new ResumeQueryEvent());
//   }
// }
