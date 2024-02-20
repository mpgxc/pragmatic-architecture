import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RegisterPartner } from '@usecases/partner/register-partner';
import { PartnerRegister } from './validators/partner';

@ApiTags('Partners')
@Controller('partner')
export class PartnerController {
  constructor(private readonly registerPartner: RegisterPartner) {}

  @Post()
  async create(@Body() payload: PartnerRegister) {
    await this.registerPartner.execute(payload);
  }
}
