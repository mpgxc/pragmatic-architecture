import { Injectable } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

import { FirebaseProvider } from './firebase';
import { LoggerService } from '@mpgxc/logger';

export enum Storage {
  LOCAL = 'local',
  FIREBASE = 'firebase',
}

export type StorageFactory = Record<
  Storage,
  FirebaseStorageProvider | LocalStorageProvider
>;

export type UploadFileOptions = {
  file: MultipartFile;
  folderName: string;
  filename: string;
};

export interface IFileProvider {
  upload(input: UploadFileOptions): Promise<void>;
  remove(filename: string, prefix: string): Promise<void>;
}

@Injectable()
export class FirebaseStorageProvider implements IFileProvider {
  constructor(private readonly firebase: FirebaseProvider) {}

  async upload(input: UploadFileOptions): Promise<void> {
    const bucket = this.firebase.getBucket();
    const buffer = await input.file.toBuffer();

    await new Promise((resolve, reject) => {
      const uploadFile = bucket.file(`${input.folderName}/${input.filename}`);

      const stream = uploadFile.createWriteStream({
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: input.filename,
          },
          contentType: input.file.mimetype,
        },
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        resolve(input.filename);
      });

      stream.end(buffer);
    });
  }

  async remove(filename: string, prefix: string): Promise<void> {
    const bucket = this.firebase.getBucket();

    await bucket.file(`${prefix}/${filename}`).delete({ ignoreNotFound: true });
  }
}

@Injectable()
export class LocalStorageProvider implements IFileProvider {
  constructor(private readonly logger: LoggerService) {}

  async upload(input: UploadFileOptions): Promise<void> {
    const writeStream = createWriteStream(resolve('uploads', input.filename));
    const { file } = input;

    file.file.pipe(writeStream);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(filename: string, _prefix: string): Promise<void> {
    try {
      unlinkSync(resolve('uploads', filename));
    } catch (error) {
      this.logger.log('Error on remove file from local storage');
    }
  }
}
