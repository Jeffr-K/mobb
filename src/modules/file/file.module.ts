import { Module } from '@nestjs/common';
import { FileController } from '@modules/file/interface/controller/file.controller';
import { AWSModule } from '@infrastructure/aws/aws.module';
import { MinioCustomModule } from '@/infrastructure/database/minio/minio.module';
import { AuthModule } from '../auth/auth.module';
import { FileResizePipe } from './infrastucture/pipes/file-resize.pipe';
import { FileResizeService } from './interface/controller/file.resize.service';
import { FileRegisterCommandEventHandler } from './core/command/command.event.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { FileUpdateCommandHandler } from './core/event/event.handler';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { File } from './core/entity/file';

@Module({
  imports: [CqrsModule, AuthModule, AWSModule, MinioCustomModule, MikroOrmModule.forFeature([File])],
  providers: [FileResizePipe, FileResizeService, FileRegisterCommandEventHandler, FileUpdateCommandHandler],
  controllers: [FileController],
})
export class FileModule {}
