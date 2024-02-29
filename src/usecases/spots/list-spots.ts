import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Result } from '@common/logic';
import { Pagination } from '@infra/database/dynamo/types';

type ListSpotsInput = {
  establishmentId: UUID;
  pagination: Pagination;
};

@Injectable()
export class ListSpots {
  constructor(private readonly repository: SpotRepository) {}

  async execute({ establishmentId, pagination }: ListSpotsInput) {
    const spots = await this.repository.bind(establishmentId).list(pagination);

    return Result.Ok(spots);
  }
}
