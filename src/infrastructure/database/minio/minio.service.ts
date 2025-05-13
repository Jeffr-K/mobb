import { Injectable } from '@nestjs/common';
import { MinioRepository } from './minio.repository';
import { BufferedFile } from './bufferedFile';

@Injectable()
export class MinioService {
  constructor(private readonly minioRepository: MinioRepository) {}

  async uploadFile(bucketName: string, file: BufferedFile): Promise<{ url: string }> {
    const metaData = {
      'Content-Type': file.mimetype,
    };

    return await this.minioRepository.upload(bucketName, file, metaData);
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    await this.minioRepository.delete(bucketName, fileName);
  }

  async getFileUrl(bucketName: string, fileName: string): Promise<string> {
    return await this.minioRepository.getFileUrl(bucketName, fileName);
  }
}
