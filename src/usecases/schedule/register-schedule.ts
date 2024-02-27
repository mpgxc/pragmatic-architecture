import { UUID } from 'crypto';
import { differenceInDays, getDay, isAfter } from 'date-fns';
import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Result } from '@common/logic';
import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';

import {
  Schedule,
  ScheduleStatus,
  calculateNumberOfHours,
  validateScheduleTimes,
} from '@domain/schedule/schedule';

type ScheduleTime = {
  start: string;
  end: string;
};

type CreateScheduleInput = {
  spotId: UUID;
  scheduleTimes?: ScheduleTime[];
  date: string;
  establishmentId: UUID;
  leader: {
    leaderId: string;
    leaderName: string;
  };
};

@Injectable()
export class RegisterSchedule {
  constructor(
    private readonly repository: ScheduleRepository,
    private readonly spotRepository: SpotRepository,
  ) {}

  async execute(
    input: CreateScheduleInput,
  ): Promise<Result<unknown, HttpException>> {
    // Ordena e valida os horários de agendamentos recebidos
    const scheduleTimesAreValid = validateScheduleTimes(input.scheduleTimes);

    if (!scheduleTimesAreValid.isValid) {
      return Result.Err(
        new UnprocessableEntityException(
          'The provided times must be sequential',
        ),
      );
    }

    const [firstScheduleTime] = scheduleTimesAreValid.sortedScheduleTimes;
    const startsFullDate = new Date(`${input.date} ${firstScheduleTime.start}`);

    const now = new Date();
    const startsAfterNow = isAfter(startsFullDate, now);

    if (!startsAfterNow) {
      return Result.Err(
        new UnprocessableEntityException(
          'Schedules can only be made for a time in the future',
        ),
      );
    }

    // Máximo de antecedência
    // FIXME: Deixar dimamico por partner?!
    const MAX_DAYS_BEFORE_SCHEDULE = 10;
    const daysBetweenNowAndSchedule = differenceInDays(startsFullDate, now);

    if (daysBetweenNowAndSchedule > MAX_DAYS_BEFORE_SCHEDULE) {
      return Result.Err(
        new UnprocessableEntityException(
          'It is only possible to make schedules a maximum of 10 days in advance',
        ),
      );
    }

    const schedulesAtDate = await this.repository
      .bind(input.spotId)
      .getSchedulesByDate(input.date);

    const scheduleTimes = scheduleTimesAreValid.sortedScheduleTimes;

    const anyTimeAlreadyScheduled = schedulesAtDate.some((sechedule) =>
      sechedule?.scheduleTimes?.some(({ end, start }) =>
        scheduleTimes?.some(
          (inputTime) => inputTime.end === end && inputTime.start === start,
        ),
      ),
    );

    if (anyTimeAlreadyScheduled) {
      return Result.Err(
        new ConflictException(
          'Any of the times provided are already scheduled',
        ),
      );
    }

    const spot = await this.spotRepository
      .bind(input.establishmentId)
      .get(input.spotId);

    if (!spot) {
      return Result.Err(new NotFoundException('Spot not found'));
    }

    const weekday = getDay(startsFullDate);

    const weekdaySpotSettings = spot.Content.rentSettings.find(
      (setting) => setting.weekday === weekday,
    );

    if (!weekdaySpotSettings.available) {
      return Result.Err(
        new UnprocessableEntityException('Weekday is not available do rent'),
      );
    }

    const spotTimesSettings = weekdaySpotSettings.hours.filter((time) =>
      scheduleTimes.some(
        ({ end, start }) =>
          time.ends === end && time.starts === start && time.available,
      ),
    );

    if (
      !spotTimesSettings.length ||
      spotTimesSettings.length !== scheduleTimes.length
    )
      return Result.Err(
        new UnprocessableEntityException(
          'Weekday settings not found with the provided starts and ends hours for this spot',
        ),
      );

    const numberOfHours = calculateNumberOfHours(scheduleTimes);
    // Verificar se vai ser possível alugar po um máximo de horas.
    // Talvez nao. Deixar aberto pra ser possível alugar o dia todo pra campeonatos e etc.

    const totalValue = spotTimesSettings.reduce(
      (value, setting) => value + setting.price,
      0,
    );

    const schedule: Schedule = {
      date: input.date,
      leader: input.leader,
      partnerId: spot.Content.partnerId,
      spot: { modality: spot.Content.modality, name: spot.Content.name },
      spotId: input.spotId,
      status: ScheduleStatus.CREATED,
      statusUpdates: [
        { at: now.toISOString(), status: ScheduleStatus.CREATED },
      ],
      totalValue,
      establishmentId: input.establishmentId,
      scheduleTimes: input.scheduleTimes,
      numberOfHours,
    };

    await this.repository.bind(input.spotId).create(schedule);

    return Result.Ok();
  }
}
