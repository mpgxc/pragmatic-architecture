import { Injectable, NotFoundException } from '@nestjs/common';

import { Establishment } from '@domain/establishment';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { UUID } from 'node:crypto';

@Injectable()
export class UpdateEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(
    partnerId: UUID,
    establishmentId: UUID,
    props: Partial<Establishment>,
  ) {
    const establishment = await this.repository
      .bind(partnerId)
      .get(establishmentId);

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    await this.repository.bind(partnerId).update(establishmentId, props);
  }
}
