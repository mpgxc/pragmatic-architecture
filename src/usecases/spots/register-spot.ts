import { UUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Spot } from '@domain/spot';
import { Result } from '@common/logic';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

type Hour = {
  isPremium: boolean;
  starts: string;
  ends: string;
  price: number;
  available: boolean;
};

type WeekDaysRentSettingsInput = {
  weekday: number;
  hours: Hour[];
  available: boolean;
};

type RegisterSpotInput = {
  name: string;
  modality: string;
  rentSettings?: WeekDaysRentSettingsInput[];
  partnerId?: UUID;
  establishmentId?: UUID;
};

@Injectable()
export class RegisterSpot {
  constructor(
    private readonly repository: SpotRepository,
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  async execute(input: RegisterSpotInput) {
    const establishment = await this.establishmentRepository
      .bind(input.partnerId)
      .get(input.establishmentId);

    if (!establishment) {
      return Result.Err(new NotFoundException('Establishment not found'));
    }

    const spot: Spot = {
      rentSettings: input.rentSettings,
      modality: input.modality,
      name: input.name,
      establishmentId: input.establishmentId,
      partnerId: input.partnerId,
    };

    await this.repository.bind(input.establishmentId).create(spot);

    return Result.Ok();
  }
}
