import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateSchedule } from '@usecases/schedule/create-schedule';

@ApiTags('Schedules')
@Controller('/partner/:partnerId/schedules')
export class ScheduleController {
  constructor(private readonly createSchedule: CreateSchedule) {}

  @Post()
  async create(@Body() payload) {
    console.log({ payload });

    await this.createSchedule.execute();
  }
}
