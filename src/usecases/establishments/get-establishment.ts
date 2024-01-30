import { Injectable } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

@Injectable()
export class GetEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(id: string) {
    const establishment = await this.repository.getEstablishment(id);

    return establishment;
  }
}
