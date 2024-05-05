import { createWriteStream, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

import { LoggerService } from '@mpgxc/logx';
import { Injectable } from '@nestjs/common';

import { IStorageProvider, UploadFileOptions } from './storage.provider';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  constructor(private readonly logger: LoggerService) {}

  async upload(input: UploadFileOptions): Promise<void> {
    const writeStream = createWriteStream(resolve('uploads', input.filename));

    writeStream.write(input.file.buffer);
  }

  async remove(filename: string): Promise<void> {
    try {
      unlinkSync(resolve('uploads', filename));
    } catch (error) {
      this.logger.log('Error on remove file from local storage');
    }
  }

  getUrl(filename: string): string {
    return filename;
  }
}
