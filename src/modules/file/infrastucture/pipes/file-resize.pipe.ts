import { ArgumentMetadata, Injectable, Logger, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import { FileResizeFailedException } from '../../core/exception/file-resize-failed.exception';

@Injectable()
export class FileResizePipe implements PipeTransform {
  private readonly logger = new Logger(FileResizePipe.name);

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      if (Array.isArray(value)) {
        return Promise.all(value.map((file) => this.resize(file)));
      } else if (value && value.buffer) {
        return this.resize(value);
      }
      return value;
    } catch (error) {
      this.logger.error('Error resizing file', error);
      throw new FileResizeFailedException(error.message);
    }
  }

  private async resize(file: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      const outputBuffer = await sharp(file.buffer).resize(800, 600).webp({ quality: 80 }).toBuffer();

      file.buffer = outputBuffer;
      file.mimetype = 'image/webp';
      file.originalname = file.originalname.replace(/\.[^/.]+$/, '.webp');

      return file;
    } catch (error) {
      this.logger.error('Error resizing file', error);
      throw new FileResizeFailedException(error.message);
    }
  }
}
