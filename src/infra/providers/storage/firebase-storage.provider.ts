import { Injectable } from '@nestjs/common';

import { IStorageProvider, UploadFileOptions } from './storage.provider';
import { FirebaseProvider } from '../firebase';

@Injectable()
export class FirebaseStorageProvider implements IStorageProvider {
  constructor(private readonly firebase: FirebaseProvider) {}

  async upload(input: UploadFileOptions): Promise<void> {
    const bucket = this.firebase.getBucket();

    await new Promise((resolve, reject) => {
      const uploadFile = bucket.file(`${input.filename}`);

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

      stream.end(input.file.buffer);
    });
  }

  async remove(filename: string, prefix: string): Promise<void> {
    const bucket = this.firebase.getBucket();

    await bucket.file(`${prefix}/${filename}`).delete({ ignoreNotFound: true });
  }

  getUrl(filename: string): string {
    const [prefix, file] = filename.split('/');
    return `https://firebasestorage.googleapis.com/v0/b/uzze-delivery.appspot.com/o/${prefix}%2F${file}?alt=media`;
  }
}
