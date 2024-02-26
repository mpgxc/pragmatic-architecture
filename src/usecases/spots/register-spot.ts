import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Spot } from '@domain/spot/spot';
import { Result } from '@common/logic';

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
  constructor(private readonly repository: SpotRepository) {}

  async execute(input: RegisterSpotInput) {
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
