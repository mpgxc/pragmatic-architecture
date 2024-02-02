import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type BusinessInfo = {
  uf: string;
  cep: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  logradouro: string;
  complemento: string;
  numero: string;
  bairro: string;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  qsa: Array<{
    nome_socio: string;
  }>;
};

type BusinessInfoOutput = {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  phones: string[];
  partners: string[];
  address: {
    uf: string;
    cep: string;
    bairro: string;
    numero: string;
    logradouro: string;
    municipio: string;
    complemento: string;
    prefix_logradouro: string;
  };
};

@Injectable()
export class CnpjProvider {
  constructor(private readonly http: HttpService) {}

  private mapper = (o: BusinessInfo): BusinessInfoOutput => ({
    razao_social: o.razao_social,
    nome_fantasia: o.nome_fantasia ?? '',
    cnpj: o.cnpj,
    phones: [o.ddd_telefone_1, o.ddd_telefone_2].filter(Boolean),
    partners: o.qsa.map(({ nome_socio }) => nome_socio),
    address: {
      logradouro: o.logradouro,
      prefix_logradouro: o.logradouro,
      municipio: o.municipio,
      uf: o.uf,
      cep: o.cep,
      complemento: o.complemento,
      bairro: o.bairro,
      numero: o.numero,
    },
  });

  getCnpj = async (cnpj: string): Promise<BusinessInfoOutput> => {
    const { data } = await firstValueFrom(
      this.http.get(`https://minhareceita.org/${cnpj}`),
    ).catch(({ status }) => ({
      data: null,
      status,
    }));

    return data ? this.mapper(data) : ({} as BusinessInfoOutput);
  };
}
