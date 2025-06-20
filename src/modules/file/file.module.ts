import { Module } from '@nestjs/common';
import { FileController } from '@modules/file/interface/controller/file.controller';
import { AWSModule } from '@infrastructure/aws/aws.module';

@Module({
  imports: [AWSModule],
  providers: [],
  controllers: [FileController],
})
export class FileModule {}
