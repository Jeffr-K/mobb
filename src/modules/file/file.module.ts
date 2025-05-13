import { Module } from '@nestjs/common';
import { FileController } from '@modules/file/interface/controller/file.controller';
import { AWSModule } from '@infrastructure/aws/aws.module';
import { MinioCustomModule } from '@/infrastructure/database/minio/minio.module';
import { AuthModule } from '../auth/auth.module';
import { FileResizePipe } from './infrastucture/pipes/file-resize.pipe';
import { FileResizeService } from './interface/controller/file.resize.service';

@Module({
  imports: [AuthModule, AWSModule, MinioCustomModule],
  providers: [FileResizePipe, FileResizeService],
  controllers: [FileController],
})
export class FileModule {}
