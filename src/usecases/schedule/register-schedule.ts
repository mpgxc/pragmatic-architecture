import { UUID } from 'crypto';
import { getDay, isBefore } from 'date-fns';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Result } from '@common/logic';
import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';

import { ScheduleStatus } from '@domain/schedule/schedule';

type CreateScheduleInput = {
  spotId: UUID;
  date: string;
  starts: string;
  ends: string;
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
    const startsFullDate = new Date(`${input.date} ${input.starts}`);
    const endsFullDate = new Date(`${input.date} ${input.ends}`);

    // TODO: verificar se o agendamento está sendo feito para data futura

    const startsBeforeEnds = isBefore(startsFullDate, endsFullDate);

    if (!startsBeforeEnds) {
      return Result.Err(
        new BadRequestException('Starts hour must be before ends hour'),
      );
    }

    //TODO: Verificar quantidade maxima de horas que pode alugar
    // const diffHours = differenceInHours(endsFullDate, startsFullDate);

    const schedulesAtDate = await this.repository
      .bind(input.spotId)
      .getSchedulesByDate(input.date);

    const hourAlreadyScheduled = schedulesAtDate.some(
      ({ starts, ends }) => starts === input.starts && ends === input.ends,
    );

    if (hourAlreadyScheduled) {
      return Result.Err(new ConflictException('This hour already scheduled'));
    }

    const { Content: spot } = await this.spotRepository
      .bind(input.establishmentId)
      .get(input.spotId);

    if (!spot) {
      return Result.Err(new NotFoundException('Spot not found'));
    }

    const weekday = getDay(startsFullDate);

    const weekdaySpotSettings = spot.rentSettings.find(
      (setting) => setting.weekday === weekday,
    );

    if (!weekdaySpotSettings.available) {
      return Result.Err(
        new UnprocessableEntityException('Weekday is not available do rent'),
      );
    }

    const hourSetting = weekdaySpotSettings.hours.find(
      ({ starts, ends }) => starts === input.starts && ends === input.ends,
    );

    if (!hourSetting)
      return Result.Err(
        new UnprocessableEntityException(
          'Weekday settings not found with the provided starts and ends hours',
        ),
      );

    if (!hourSetting.available) {
      return Result.Err(
        new UnprocessableEntityException('Hour is not available to rent'),
      );
    }

    await this.repository.bind(input.spotId).create({
      starts: input.starts,
      ends: input.ends,
      date: input.date,
      leader: input.leader,
      partnerId: spot.partnerId,
      spot: { modality: spot.modality, name: spot.name },
      spotId: input.spotId,
      status: ScheduleStatus.CREATED,
      statusUpdates: [{ at: new Date(), status: ScheduleStatus.CREATED }],
      totalValue: hourSetting.price,
      establishmentId: input.establishmentId,
    });

    return Result.Ok();
  }
}
