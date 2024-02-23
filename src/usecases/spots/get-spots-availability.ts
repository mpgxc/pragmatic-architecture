import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';

import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';
import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Result } from '@common/logic';
import { getDay, startOfDay, addDays } from 'date-fns';

type GetSpotsAvailabilityInput = {
  date: string;
  establishmentId: UUID;
};

@Injectable()
export class GetSpotsAvailability {
  constructor(
    private readonly spotRepository: SpotRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async execute(input: GetSpotsAvailabilityInput) {
    const { Items: spots } = await this.spotRepository
      .bind(input.establishmentId)
      .list({ limit: 10, sort: 'ASC' });

    const establishmentSchedules = await this.scheduleRepository
      .bind()
      .getSchedulesAtEstablishmentByDate(input.date, input.establishmentId);

    // FIXME: Nao sei pq só fica o dia certo se for assim
    const today = startOfDay(addDays(input.date, 1));

    const filterWeekday = getDay(today);

    const establishmentAvailability = spots.map(({ Content: spot }) => {
      const spotWeekDay = spot.rentSettings.find(
        (setting) => setting.weekday === filterWeekday,
      );

      const spotAvailability = spotWeekDay.hours.map((hour) => {
        const alreadyRented = establishmentSchedules.some(
          (schedule) =>
            schedule.starts === hour.starts && schedule.ends === hour.ends,
        );

        return {
          ...hour,
          isRented: alreadyRented,
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
