import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

@Injectable()
export class GetEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(partnerId: UUID, establishmentId: UUID) {
    return this.repository.bind(partnerId).get(establishmentId);
  }
}
