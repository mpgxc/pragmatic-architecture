import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { RentSettings, Spot } from '@domain/spot/spot';
import { Ok } from '@common/logic';

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
    const rentSettings: RentSettings = input.rentSettings.reduce(
      (acc, setting) => {
        acc[`weekday_${setting.weekday}`] = {
          available: setting.available,
          hours: setting.hours,
        };

        return acc;
      },
      {},
    ) as RentSettings;

    const spot: Spot = {
      rentSettings: rentSettings,
      modality: input.modality,
      name: input.name,
      establishmentId: input.establishmentId,
      partnerId: input.partnerId,
    };

    await this.repository.create(spot);

    return Ok();
  }
}
