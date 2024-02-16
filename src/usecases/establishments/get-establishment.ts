import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import {
  InjectStorage,
  StorageProvider,
} from '@infra/providers/storage/storage.factory';
import { Err, Ok } from '@common/logic';

@Injectable()
export class GetEstablishment {
  constructor(
    private readonly repository: EstablishmentRepository,
    @InjectStorage() private readonly storage: StorageProvider,
  ) {}

  async execute(partnerId: UUID, establishmentId: UUID) {
    const establishment = await this.repository
      .bind(partnerId)
      .get(establishmentId);

    if (!establishment)
      return Err(new NotFoundException('Estalbishment not found!'));

    establishment.Content.pictures = establishment.Content.pictures.map(
      (picture) => this.storage.getUrl(picture),
    );

    return Ok(establishment);
  }
}
