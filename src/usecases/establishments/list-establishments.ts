import { Pagination } from '@infra/database/dynamo/types';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';

type ListEstablishmentsInput = {
  pagination: Pagination;
};

@Injectable()
export class ListEstablishments {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(input: ListEstablishmentsInput) {
    return this.repository.list(input.pagination);
  }
}
