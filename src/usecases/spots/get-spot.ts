import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Ok } from '@common/logic';

type GetSpotInput = {
  establishmentId: UUID;
  spotId: UUID;
};

@Injectable()
export class GetSpot {
  constructor(private readonly repository: SpotRepository) {}

  async execute({ establishmentId, spotId }: GetSpotInput) {
    const spot = await this.repository.bind(establishmentId).get(spotId);

    if (!spot) {
      throw new NotFoundException('Spot not found!');
    }

    return Ok(spot);
  }
}
