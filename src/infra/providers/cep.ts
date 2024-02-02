import { AddressInfo } from '@common/types';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type AddressInfoProps = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

@Injectable()
export class CepProvider {
  constructor(private readonly http: HttpService) {}

  private mapper = (o: AddressInfoProps): AddressInfo => {
    const [prefix_logradouro, ...logradouro] = o.street.split(' ');

    return {
      uf: o.state,
      cep: o.cep,
      bairro: o.neighborhood,
      municipio: o.city,
      logradouro: logradouro.join(' '),
      prefix_logradouro,
      numero: '',
      complemento: '',
    };
  };

  getCep = async (cep: string): Promise<AddressInfo> => {
    const { data } = await Promise.race([
      firstValueFrom(
        this.http.get(`https://brasilapi.com.br/api/cep/v1/${cep}`),
      ),
      firstValueFrom(
        this.http.get(`https://brasilapi.com.br/api/cep/v2/${cep}`),
      ),
    ]).catch(({ status }) => ({
      data: null,
      status,
    }));

    return data ? this.mapper(data) : ({} as AddressInfo);
  };
}
