import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Ok } from '@common/logic';
import { Pagination } from '@infra/database/dynamo/types';

type ListSpotsInput = {
  establishmentId: UUID;
  pagination: Pagination;
};

@Injectable()
export class ListSpots {
  constructor(private readonly repository: SpotRepository) {}

  async execute({ establishmentId, pagination }: ListSpotsInput) {
    const spot = await this.repository.bind(establishmentId).list(pagination);

    if (!spot.Items.length) {
      throw new NotFoundException('Spot not found!');
    }

    return Ok(spot);
  }
}
