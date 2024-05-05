import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from '@mpgxc/logx';
import { FirebaseStorageProvider } from './firebase-storage.provider';
import { LocalStorageProvider } from './local-storage.provider';

const StorageProvider = 'StorageProvider';

type StorageProvider = FirebaseStorageProvider | LocalStorageProvider;

enum Storage {
  LOCAL = 'local',
  FIREBASE = 'firebase',
}

export type StorageFactory = Record<Storage, StorageProvider>;

export const InjectStorage = () => Inject(StorageProvider);

const storageFactoryProvider: Provider = {
  provide: StorageProvider,
  useFactory: (
    firebaseStorageProvider: FirebaseStorageProvider,
    localStorageProvider: LocalStorageProvider,
    config: ConfigService,
    logger: LoggerService,
  ) => {
    const storageFactory: StorageFactory = {
      local: localStorageProvider,
      firebase: firebaseStorageProvider,
    };
    logger.setContext('StorageFactoryProvider');
    const storageSetting = config.get('STORAGE');

    if (!Object.values(Storage).includes(storageSetting)) {
      logger.error(
        `Storage setting provided is not available. Try any one of the: [${Object.values(Storage)}]`,
      );
      throw new Error('Invalid storage');
    }

    return storageFactory[config.get('STORAGE')] || localStorageProvider;
  },
  inject: [
    FirebaseStorageProvider,
    LocalStorageProvider,
    ConfigService,
    LoggerService,
  ],
};

export { Storage, storageFactoryProvider, StorageProvider };
