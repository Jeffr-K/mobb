import { Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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

@ApiTags('Files')
@Controller({ path: 'files', version: ['1'] })
export class FileController {
  constructor(private readonly minioService: MinioService, private readonly fileResizeService: FileResizeService) {}

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
  async uploadFile(@UploadedFile(FileResizePipe) file: Express.Multer.File): Promise<{ url: string }> {
    return await this.minioService.uploadFile('bucket-name', file as any);
  }
}
