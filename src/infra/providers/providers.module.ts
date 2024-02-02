import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { CepProvider } from './cep';
import { CnpjProvider } from './cnpj';

@Module({
  imports: [HttpModule],
  providers: [CepProvider, CnpjProvider],
  exports: [CepProvider, CnpjProvider],
})
export class ProvidersModule {}
