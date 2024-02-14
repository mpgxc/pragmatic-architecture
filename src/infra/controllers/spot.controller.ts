import { UUID } from 'node:crypto';

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { SpotRegister } from './validators/spot';

import { RegisterSpot } from '@usecases/spots/register-spot';
import { GetSpot } from '@usecases/spots/get-spot';
import { QueryParams } from './validators/query';
import { ListSpots } from '@usecases/spots/list-spots';

@ApiTags('Spots')
@Controller('partner/:partnerId/establishment/:establishmentId/spots')
export class SpotController {
  constructor(
    private readonly logger: LoggerService,
    private readonly registerSpot: RegisterSpot,
    private readonly getSpot: GetSpot,
    private readonly listSpots: ListSpots,
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

  @Get('/:spotId')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async retrieve(
    @Param('spotId') spotId: UUID,
    @Param('establishmentId') establishmentId: UUID,
    @Param('partnerId') partnerId: UUID,
  ) {
    this.logger.log('retrieve spot > params', {
      spotId,
      establishmentId,
      partnerId,
    });

    const output = await this.getSpot.execute({ establishmentId, spotId });

    this.logger.log('retrieve spot > success', output.value);

    return output.value;
  }

  @Get()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId') establishmentId: UUID,
    @Query() { limit, sort, page }: QueryParams,
  ) {
    this.logger.log('list spots > params', { partnerId });

    const output = await this.listSpots.execute({
      establishmentId,
      pagination: {
        limit,
        sort,
        page,
      },
    });

    this.logger.log('list spots > success', output);

    return output;
  }
}
