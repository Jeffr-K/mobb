import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { MinioRepository } from './minio.repository';
import { MinioService } from './minio.service';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioService, MinioRepository],
  exports: [MinioService, MinioRepository],
})
export class MinioCustomModule {}
