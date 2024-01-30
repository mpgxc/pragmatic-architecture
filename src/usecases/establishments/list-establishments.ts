import { Pagination } from '@infra/database/dynamo/type';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';

type ListEstablishmentsInput = {
  pagination: Pagination;
};

@Injectable()
export class ListEstablishments {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(input: ListEstablishmentsInput) {
    const establishment = await this.repository.list(input.pagination);

    return establishment;
  }
}
