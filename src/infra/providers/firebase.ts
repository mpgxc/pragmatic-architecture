import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseProvider {
  private readonly storage: firebase.storage.Storage;

  constructor(private readonly config: ConfigService) {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert({
          privateKey: config.get('FIREBASE_PRIVATE_KEY'),
          projectId: config.get('FIREBASE_PROJECT_ID'),
          clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
        }),
      });
    }

    this.storage = firebase.storage();
  }

  getBucket() {
    return this.storage.bucket(this.config.get('FIREBASE_BUCKET_NAME'));
  }
}
