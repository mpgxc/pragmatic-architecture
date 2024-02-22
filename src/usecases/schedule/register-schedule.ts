import { Result } from '@common/logic';
import { ScheduleStatus } from '@domain/schedule/schedule';
import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { differenceInHours, isBefore } from 'date-fns';

type CreateScheduleInput = {
  spotId: UUID;
  date: string;
  starts: string;
  ends: string;
};

@Injectable()
export class RegisterSchedule {
  constructor(private readonly repository: ScheduleRepository) {}

  async execute(
    input: CreateScheduleInput,
  ): Promise<Result<unknown, ConflictException>> {
    const startsFullDate = new Date(`${input.date} ${input.starts}`);
    const endsFullDate = new Date(`${input.date} ${input.ends}`);

    const startsBeforeEnds = isBefore(startsFullDate, endsFullDate);

    if (!startsBeforeEnds) {
      return Result.Err(
        new BadRequestException('Starts hour must be before ends hour'),
      );
    }

    //TODO: Verificar quantidade maxima de horas que pode alugar
    const diffHours = differenceInHours(endsFullDate, startsFullDate);

    console.log({ startsFullDate, endsFullDate, startsBeforeEnds, diffHours });

    const schedulesAtDate = await this.repository
      .bind(input.spotId)
      .getSchedulesByDate(input.date);

    if (!schedulesAtDate.length) {
      console.log('no has schedules at', { date: input.date, schedulesAtDate });
    }

    const hourAlreadyScheduled = schedulesAtDate.some(
      ({ starts, ends }) => starts === input.starts && ends === input.ends,
    );

    if (hourAlreadyScheduled) {
      return Result.Err(new ConflictException('This hour already scheduled'));
    }

    console.log({ hourAlreadyScheduled });

    // await this.repository.bind('83edad6d-35f0-429c-b046-f33363bbd40e').create({
    //   starts: '19:00',
    //   ends: '20:00',
    //   date: '2024-02-23',
    //   leader: { leaderId: '123123', leaderName: 'Deusimar' },
    //   partnerId: 'c48cb0b4-7927-4aee-addc-2f81b4e74314',
    //   spot: { modality: 'poliesportiva', name: 'Quadra A' },
    //   spotId: '83edad6d-35f0-429c-b046-f33363bbd40e',
    //   status: ScheduleStatus.CREATED,
    //   statusUpdates: [{ at: new Date(), status: ScheduleStatus.CREATED }],
    //   totalValue: 100,
    //   establishmentId: 'aaed57d1-0d65-4491-8ca0-f214fe8fc68a',
    //   scheduleId: randomUUID(),
    // });

    return Result.Ok();
  }
}
