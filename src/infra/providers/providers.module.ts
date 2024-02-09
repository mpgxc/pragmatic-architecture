import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { CepProvider } from './cep';
import { CnpjProvider } from './cnpj';
import { FirebaseProvider } from './firebase';
import { LocalStorageProvider } from './storage/local-storage.provider';
import { FirebaseStorageProvider } from './storage/firebase-storage.provider';
import { storageFactoryProvider } from './storage/storage.factory';

@Module({
  imports: [HttpModule],
  providers: [
    CepProvider,
    CnpjProvider,
    FirebaseProvider,
    LocalStorageProvider,
    FirebaseStorageProvider,
    storageFactoryProvider,
  ],
  exports: [CepProvider, CnpjProvider, storageFactoryProvider],
})
export class ProvidersModule {}
