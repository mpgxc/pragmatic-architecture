import { Pagination } from '@infra/database/dynamo/types';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';

type ListEstablishmentsProps = {
  pagination: Pagination;
};

@Injectable()
export class ListEstablishments {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(partnerId: UUID, props: ListEstablishmentsProps) {
    return this.repository.bind(partnerId).list(props.pagination);
  }
}
