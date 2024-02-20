import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseProvider {
  private readonly storage: firebase.storage.Storage;
  private configs: firebase.AppOptions = {};

  constructor(private readonly config: ConfigService) {
    if (this.shouldInitializeFirebase()) {
      this.configs = {
        credential: this.getCredentials(),
      };
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(this.configs);
    }

    this.storage = firebase.storage();
  }

  private shouldInitializeFirebase = () =>
    ['prd', 'hml'].includes(this.config.getOrThrow('NODE_ENV'));

  private getCredentials = (): firebase.credential.Credential =>
    firebase.credential.cert({
      privateKey: this.config.get('FIREBASE_PRIVATE_KEY'),
      projectId: this.config.get('FIREBASE_PROJECT_ID'),
      clientEmail: this.config.get('FIREBASE_CLIENT_EMAIL'),
    });

  getBucket = () =>
    this.storage.bucket(this.config.get('FIREBASE_BUCKET_NAME'));
}
