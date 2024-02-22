import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterSchedule } from '@usecases/schedule/register-schedule';

@ApiTags('Schedules')
@Controller('/partner/:partnerId/schedules')
export class ScheduleController {
  constructor(private readonly registerSchedule: RegisterSchedule) {}

  @Post()
  async create(@Body() payload) {
    console.log({ payload });

    await this.registerSchedule.execute();
  }
}
