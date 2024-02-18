import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as firebase from 'firebase-admin';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseProvider implements OnModuleDestroy {
  private readonly storage: firebase.storage.Storage;
  private credentials: firebase.credential.Credential;

  constructor(private readonly config: ConfigService) {
    if (!firebase.apps.length) {
      const configs = ['prd', 'hml'].includes(
        this.config.getOrThrow('NODE_ENV'),
      )
        ? { credential: this.credentials }
        : {};

      firebase.initializeApp(configs);
    }

    this.storage = firebase.storage();
  }

  onModuleDestroy() {
    this.credentials = firebase.credential.cert({
      privateKey: this.config.get('FIREBASE_PRIVATE_KEY'),
      projectId: this.config.get('FIREBASE_PROJECT_ID'),
      clientEmail: this.config.get('FIREBASE_CLIENT_EMAIL'),
    });
  }

  getBucket() {
    return this.storage.bucket(this.config.get('FIREBASE_BUCKET_NAME'));
  }
}
