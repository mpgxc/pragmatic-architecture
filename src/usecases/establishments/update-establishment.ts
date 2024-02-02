import { Injectable, NotFoundException } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Establishment } from '@domain/establishment/establishment';

@Injectable()
export class UpdateEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(input: Establishment) {
    const establishment = await this.repository.getEstablishment(input.id);

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    await this.repository.update(input);
  }
}
