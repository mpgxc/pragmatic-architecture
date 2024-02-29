import { OptionalPromise } from '@common/logic';
import { Pagination } from '@infra/database/dynamo/types';
import { UUID } from 'node:crypto';

export type OutputList<E> = {
  Items: E[];
  LastEvaluatedKey: string;
  Count: number;
};

export interface Repository<E, Filters = any> {
  create(props: E): Promise<void>;
  get(id: UUID): OptionalPromise<E>;
  list(pagination: Pagination, filters?: Filters): Promise<OutputList<E>>;
  update(id: UUID, payload: Partial<E>): Promise<void>;
}

export type Entity<Content = any> = {
  PK: string;
  SK: string;
  Content: Content;
  Updated?: string;
  Created: string;
  /**
   * Por padrão, o status é 'Ativo'
   */
  Status?: 'Ativo' | 'Inativo'; //'Excluído';
};

export type AddressInfo = {
  logradouro: string;
  prefix_logradouro: string;
  municipio: string;
  uf: string;
  cep: string;
  complemento: string;
  bairro: string;
  numero: string;
};
