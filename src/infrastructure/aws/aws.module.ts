import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BucketService } from '@infrastructure/aws/bucket.service';
import { FileController } from '@modules/file/interface/file.controller';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [
    BucketService,
    {
      provide: 'S3_CLIENT',
      useFactory: () => {
        return new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
      },
    },
  ],
  exports: [BucketService],
})
export class AWSModule {}
