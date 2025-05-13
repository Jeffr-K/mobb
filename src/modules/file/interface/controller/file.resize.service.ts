import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class FileResizeService {
  async resize(file: Express.Multer.File): Promise<Express.Multer.File> {
    const outputBuffer = await sharp(file.buffer).resize(800, 600).webp({ quality: 80 }).toBuffer();

    file.buffer = outputBuffer;
    file.mimetype = 'image/webp';
    file.originalname = file.originalname.replace(/\.[^/.]+$/, '.webp');

    return file;
  }
  /**
   * 여러 파일을 리사이즈합니다.
   * @param files - 리사이즈할 파일 목록
   * @returns - 리사이즈된 파일 목록
   */
  async resizeMany(files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    return Promise.all(files.map((file) => this.resize(file)));
  }
}
