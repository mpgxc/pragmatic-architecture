import { CepProvider } from '@infra/providers/cep';
import { CnpjProvider } from '@infra/providers/cnpj';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Third Party')
@Controller('third-party')
export class ThirdPartyController {
  constructor(
    private readonly cnpjProvider: CnpjProvider,
    private readonly cepProvider: CepProvider,
  ) {}

  @Get('cnpj/:cnpj')
  async getCnpj(@Param('cnpj') cnpj: string) {
    return this.cnpjProvider.getCnpj(cnpj) as any;
  }

  @Get('cep/:cep')
  async getCep(@Param('cep') cep: string) {
    throw new Error('Not implemented');
  }
}
