import { Module } from '@nestjs/common';
import { MinioModule as Minio } from 'nestjs-minio-client';

@Module({
  imports: [
    Minio.register({
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'minio_access_key',
      secretKey: 'minio_secret_key',
    }),
  ],
})
export class MinioModule {}
