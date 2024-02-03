import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';

@Injectable()
export class GetEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(partnerId: UUID, establishmentId: UUID) {
    return this.repository.bind(partnerId).get(establishmentId);
  }
}
