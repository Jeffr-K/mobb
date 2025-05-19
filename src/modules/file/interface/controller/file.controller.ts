import { Controller, HttpStatus, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '@/infrastructure/database/minio/minio.service';
import { TokenGuard } from '@/modules/auth/infrastructure/guard/jwt.v2.guard';
import { SessionValidationGuard } from '@/modules/auth/infrastructure/guard/session-validation.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guard/roles.guard';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from '@/modules/user/core/value/enum/role';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileResizePipe } from '../../infrastucture/pipes/file-resize.pipe';
import { FileResizeService } from './file.resize.service';
import { FileRegisterCommandEvent } from '../../core/command/command.event';
import { Secured } from '@/modules/auth/infrastructure/guard/token.guard.decorator';
import { User } from '@/modules/user/core/entity/user';
import { FileRegisterCommandEventHandler } from '../../core/command/command.event.handler';
import { BusinessResponse } from '@/infrastructure/utils/base/base-response';

@ApiTags('Files')
@Controller({ path: 'files', version: ['1'] })
export class FileController {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileRegisterCommandEventHandler: FileRegisterCommandEventHandler,
    private readonly fileResizeService: FileResizeService,
  ) {}

  @Post('multiple-upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '파일 목록 업로드', description: '파일 목록 업로드.' })
  @ApiResponse({
    status: 200,
    description: '파일 업로드 성공',
    type: String,
  })
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles(FileResizePipe) files: Array<Express.Multer.File>,
  ): Promise<Array<{ url: string }>> {
    return Promise.all(files.map((file) => this.minioService.uploadFile('bucket-name', file as any)));
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '파일 단건 업로드', description: '파일 단건 업로드.' })
  @ApiResponse({
    status: 200,
    description: '파일 업로드 성공',
    type: String,
  })
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Secured() user: User,
    @UploadedFile(FileResizePipe) file: Express.Multer.File,
  ): Promise<BusinessResponse<{ uuid: string; url: string }>> {
    const uploadedFile = await this.minioService.uploadFile('bucket-name', file as any);
    const result = await this.fileRegisterCommandEventHandler.execute(
      new FileRegisterCommandEvent({
        filename: file.originalname,
        filesize: file.size,
        mimetype: file.mimetype,
        encoding: file.encoding,
        metadata: file.fieldname,
        bucketName: uploadedFile.bucketName,
        fileUrl: uploadedFile.url,
        user: user,
        feed: null,
      }),
    );

    return new BusinessResponse<{ uuid: string; url: string }>(result, '파일 업로드 성공', HttpStatus.OK);
  }
}
