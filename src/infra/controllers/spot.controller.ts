import { UUID } from 'node:crypto';

import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { SpotRegister } from './validators/spot';

import { RegisterSpot } from '@usecases/spots/register-spot';

@ApiTags('Spots')
@Controller('partner/:partnerId/establishment/:establishmentId/spots')
export class SpotController {
  constructor(
    private readonly logger: LoggerService,
    private readonly registerSpot: RegisterSpot,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The spot has been successfully registered.',
  })
  async create(
    @Body() payload: SpotRegister,
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId') establishmentId: UUID,
  ) {
    this.logger.log('create spot > params', {
      payload,
    });

    const output = await this.registerSpot.execute({
      ...payload,
      partnerId,
      establishmentId,
    });

    if (!output.isOk) {
      this.logger.error('create spot > fail', { error: output.value });
    }

    this.logger.log('create spot  > success');
  }
}
