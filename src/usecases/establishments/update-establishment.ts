import { Injectable, NotFoundException } from '@nestjs/common';

import { Establishment } from '@domain/establishment/establishment';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

@Injectable()
export class UpdateEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(id: string, props: Partial<Establishment>) {
    const establishment = await this.repository.get(id);

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    await this.repository.update(id, props);
  }
}
