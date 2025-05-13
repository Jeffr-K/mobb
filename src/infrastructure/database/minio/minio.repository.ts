import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './bufferedFile';

@Injectable()
export class MinioRepository {
  private readonly logger = new Logger(MinioRepository.name);

  constructor(private readonly minioService: MinioService) {}

  public get client() {
    return this.minioService.client;
  }

  async upload(bucketName: string, file: BufferedFile, metaData: any): Promise<{ url: string }> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;

      const bucketExists = await this.client.bucketExists(bucketName);
      if (!bucketExists) {
        await this.client.makeBucket(bucketName, 'us-east-1');
      }

      await this.client.putObject(bucketName, fileName, file.buffer, metaData);

      return {
        url: `http://127.0.0.1:9000/${bucketName}/${fileName}`,
      };
    } catch (error) {
      this.logger.error('Error uploading file to MinIO:', error);
      throw new Error('File upload failed');
    }
  }

  async delete(bucketName: string, fileName: string) {
    await this.client.removeObject(bucketName, fileName);
  }

  async getFileUrl(bucketName: string, fileName: string): Promise<string> {
    return `http://127.0.0.1:9000/${bucketName}/${fileName}`;
  }
}
