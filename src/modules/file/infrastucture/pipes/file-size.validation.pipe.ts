import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<boolean> {
    const oneKb = 1000;
    console.log(metadata);
    return value.size < oneKb;
  }
}
