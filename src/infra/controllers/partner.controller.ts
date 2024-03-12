import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterPartner } from '@usecases/partner/register-partner';
import { PartnerRegister } from './validators/partner';

@ApiTags('Partners')
@Controller('partner')
export class PartnerController {
  constructor(private readonly registerPartner: RegisterPartner) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Partner created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: PartnerRegister) {
    const { isOk, value } = await this.registerPartner.execute(payload);

    if (!isOk) throw value;
  }
}
