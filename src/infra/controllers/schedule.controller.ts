import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterSchedule } from '@usecases/schedule/register-schedule';

@ApiTags('Schedules')
@Controller('/partner/:partnerId/schedules')
export class ScheduleController {
  constructor(private readonly registerSchedule: RegisterSchedule) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() payload) {
    const result = await this.registerSchedule.execute(payload);

    if (!result.isOk) throw result.value;
  }
}
