import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { Result } from '@common/logic';
import { Spot } from '@domain/spot';
import { SpotRepository } from '@infra/database/repositories/spot.repository';

type GetSpotInput = {
  establishmentId: UUID;
  spotId: UUID;
};

@Injectable()
export class GetSpot {
  constructor(private readonly repository: SpotRepository) {}

  async execute({
    establishmentId,
    spotId,
  }: GetSpotInput): Promise<Result<Spot, NotFoundException>> {
    const spot = await this.repository.bind(establishmentId).get(spotId);

    if (!spot) {
      return Result.Err(new NotFoundException('Spot not found'));
    }

    return Result.Ok(spot);
  }
}
