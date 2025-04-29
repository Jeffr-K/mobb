// https://joojae.com/nestjs-large-file-upload-with-presigned-url-and-s3-multipart-upload/

import { BadRequestException, Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BucketService } from '@infrastructure/aws/bucket.service';
import { FilePresignedUrlRegisterAdapter } from '@modules/file/interface/adapter/in/file.command.adapter';
import { FilesInterceptor } from '@nestjs/platform-express';
import { logger } from '@mikro-orm/nestjs';

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
      return {
        success: true,
        keys: uploadedKeys,
      };
    } catch (error) {
      logger.log(`Error uploading file: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  // @Delete('/remove')
  // async remove() {}
}
