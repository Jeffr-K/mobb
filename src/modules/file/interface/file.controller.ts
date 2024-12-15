// https://joojae.com/nestjs-large-file-upload-with-presigned-url-and-s3-multipart-upload/

import { BadRequestException, Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BucketService } from '@infrastructure/aws/bucket.service';
import { FilePresignedUrlRegisterAdapter } from '@modules/file/interface/command';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'file', version: ['1'] })
export class FileController {
  constructor(private readonly bucketService: BucketService) {}

  @Post('/presigned-url')
  async getPresignedUrl(@Body() adapter: FilePresignedUrlRegisterAdapter): Promise<string> {
    return await this.bucketService.getPresignedUrl({
      fileOwner: adapter.fileOwner,
      fileUsage: adapter.fileUsage,
      fileFormat: adapter.fileUsage,
    });
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const uploadedKeys = await this.bucketService.uploadFile(files);
      return { success: true, keys: uploadedKeys };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  // 976-2216

  @Delete('/remove')
  async remove() {}
}