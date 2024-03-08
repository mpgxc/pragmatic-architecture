import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Spot } from '@domain/spot';
import { Err, Ok } from '@common/logic';

type UpdateSpotInput = {
  name: string;
  modality: string;
  spotId?: UUID;
  establishmentId?: UUID;
};

@Injectable()
export class UpdateSpot {
  constructor(private readonly repository: SpotRepository) {}

  async execute(input: UpdateSpotInput) {
    const spot = await this.repository
      .bind(input.establishmentId)
      .get(input.spotId);

    if (!spot) {
      return Err(new NotFoundException('Spot not found!'));
    }

    const spotToUpdate: Spot = {
      modality: input.modality,
      name: input.name,
    };

    await this.repository
      .bind(input.establishmentId)
      .update(input.spotId, spotToUpdate);

    return Ok();
  }
}
