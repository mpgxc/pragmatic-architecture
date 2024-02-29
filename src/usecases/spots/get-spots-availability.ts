import { UUID } from 'crypto';
import { HttpException, Injectable } from '@nestjs/common';

import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';
import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Result } from '@common/logic';
import { getDay, startOfDay, addDays } from 'date-fns';

type GetSpotsAvailabilityInput = {
  date: string;
  establishmentId: UUID;
};

type AvailabilityOutput = {
  alreadyRented: boolean;
  isPremium: boolean;
  starts: string;
  ends: string;
  price: number;
  available: boolean;
};

type GetSpotsAvailabilityOutput = {
  spotId: string;
  name: string;
  modality: string;
  availability: AvailabilityOutput[];
};

@Injectable()
export class GetSpotsAvailability {
  constructor(
    private readonly spotRepository: SpotRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async execute(
    input: GetSpotsAvailabilityInput,
  ): Promise<Result<GetSpotsAvailabilityOutput[], HttpException>> {
    const { Items: spots } = await this.spotRepository
      .bind(input.establishmentId)
      .list({ limit: 10, sort: 'ASC' });

    const establishmentSchedules = await this.scheduleRepository
      .bind()
      .getSchedulesAtEstablishmentByDate(input.date, input.establishmentId);

    // FIXME: Nao sei pq só fica o dia certo se for assim
    const today = startOfDay(addDays(input.date, 1));

    const filterWeekday = getDay(today);

    const establishmentAvailability = spots.map((spot) => {
      const spotWeekDay = spot.rentSettings.find(
        (setting) => setting.weekday === filterWeekday,
      );

      const spotAvailability = spotWeekDay.hours.map((hour) => {
        const alreadyRented = establishmentSchedules.some((schedule) =>
          schedule.scheduleTimes.some(
            ({ end, start }) => hour.starts === start && hour.ends === end,
          ),
        );

        return {
          ...hour,
          alreadyRented: alreadyRented,
        };
      });

      return {
        spotId: spot.spotId,
        name: spot.name,
        modality: spot.modality,
        availability: spotAvailability,
      };
    });

    return Result.Ok(establishmentAvailability);
  }
}
