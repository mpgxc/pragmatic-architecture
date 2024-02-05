import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { CepProvider } from './cep';
import { CnpjProvider } from './cnpj';
import { FirebaseProvider } from './firebase';
import { ConfigService } from '@nestjs/config';
import {
  FirebaseStorageProvider,
  LocalStorageProvider,
  StorageFactory,
} from './file';

@Module({
  imports: [HttpModule],
  providers: [
    CepProvider,
    CnpjProvider,
    FirebaseProvider,
    LocalStorageProvider,
    FirebaseStorageProvider,
    {
      provide: 'FileProvider',
      useFactory: (
        firebaseStorageProvider: FirebaseStorageProvider,
        localStorageProvider: LocalStorageProvider,
        config: ConfigService,
      ) => {
        const storageFactory: StorageFactory = {
          local: localStorageProvider,
          firebase: firebaseStorageProvider,
        };

        return storageFactory[config.get('STORAGE')] || localStorageProvider;
      },
      inject: [FirebaseStorageProvider, LocalStorageProvider, ConfigService],
    },
  ],
  exports: [CepProvider, CnpjProvider, 'FileProvider'],
})
export class ProvidersModule {}
