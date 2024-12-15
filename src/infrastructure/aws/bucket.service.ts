import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class BucketService {
  private readonly s3: AWS.S3;

  constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client, private readonly configService: ConfigService) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }

  async getPresignedUrl(options: { fileOwner: string; fileUsage: string; fileFormat: string }): Promise<string> {
    const filename = `${options.fileOwner}-${options.fileUsage}-${Date.now()}.${options.fileFormat}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 60 });
  }

  async uploadFile(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadSingleFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  private async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    const key = this.generateKey(file.originalname);
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'private',
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      throw new Error(`Failed to upload file ${file.originalname}: ${error.message}`);
    }
  }

  private generateKey(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    return `${timestamp}-${randomString}-${originalName}`;
  }
}
