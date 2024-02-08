import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

type UpdateEstablishmentPictureInput = {
  filename: string;
  establishmentId: UUID;
  partnerId: UUID;
};

@Injectable()
export class UpdateEstablishmentPicture {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(input: UpdateEstablishmentPictureInput) {
    const { establishmentId, partnerId, filename } = input;
    const establishment = await this.repository
      .bind(partnerId)
      .get(establishmentId);

    if (!establishment) throw new NotFoundException('Establishment not found');

    await this.repository
      .bind(partnerId)
      .update(establishmentId, { pictures: [filename] });
  }
}
