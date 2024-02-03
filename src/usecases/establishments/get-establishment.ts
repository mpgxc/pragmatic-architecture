import { Injectable } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

@Injectable()
export class GetEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(id: string) {
    return this.repository.get(id);
  }
}
