import { UUID } from 'node:crypto';

import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { SpotOutput, SpotRegister, SpotUpdate } from './validators/spot';

import { RegisterSpot } from '@usecases/spots/register-spot';
import { GetSpot } from '@usecases/spots/get-spot';
import { DateQueryParam, QueryParams } from './validators/query';
import { ListSpots } from '@usecases/spots/list-spots';
import { UpdateSpot } from '@usecases/spots/update-spot';
import { GetSpotsAvailability } from '@usecases/spots/get-spots-availability';
import { ApiResponse } from './validators/common';

@ApiTags('Spots')
@Controller('partner/:partnerId/establishment/:establishmentId/spots')
export class SpotController {
  constructor(
    private readonly logger: LoggerService,
    private readonly registerSpot: RegisterSpot,
    private readonly getSpot: GetSpot,
    private readonly listSpots: ListSpots,
    private readonly updateSpot: UpdateSpot,
    private readonly getSpotsAvailability: GetSpotsAvailability,
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
      throw output.value;
    }

    this.logger.log('create spot  > success');
  }

  @Get('/:spotId')
  @ApiResponse({ type: SpotOutput })
  @HttpCode(HttpStatus.OK)
  async retrieve(
    @Param('spotId', ParseUUIDPipe) spotId: UUID,
    @Param('establishmentId') establishmentId: UUID,
  ) {
    this.logger.log('retrieve spot > params', {
      spotId,
      establishmentId,
    });

    const output = await this.getSpot.execute({ establishmentId, spotId });

    if (!output.isOk) {
      this.logger.error('retrieve spot > fail', { error: output.value });
      throw output.value;
    }

    this.logger.log('retrieve spot > success', output.value);

    return output.value;
  }

  @Get()
  @ApiResponse({ type: SpotOutput, paginated: true })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('establishmentId', ParseUUIDPipe) establishmentId: UUID,
    @Query() { limit, sort, page }: QueryParams,
  ) {
    this.logger.log('list spots > params', {
      establishmentId,
      limit,
      sort,
      page,
    });

    const output = await this.listSpots.execute({
      establishmentId,
      pagination: {
        limit,
        sort,
        page,
      },
    });

    if (!output.isOk) {
      this.logger.error('retrieve spot > fail', { error: output.value });
      throw output.value;
    }

    this.logger.log('list spots > success', output);

    return output.value;
  }

  @Put('/:spotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The establishment has been successfully updated',
  })
  async update(
    @Body() payload: SpotUpdate,
    @Param('establishmentId', ParseUUIDPipe) establishmentId: UUID,
    @Param('spotId', ParseUUIDPipe) spotId: UUID,
  ) {
    this.logger.log('update spot > params ', {
      establishmentId,
      payload,
      spotId,
    });

    const output = await this.updateSpot.execute({
      modality: payload.modality,
      name: payload.name,
      establishmentId,
      spotId,
    });

    if (!output.isOk) {
      this.logger.error('retrieve spot > fail', { error: output.value });
      throw output.value;
    }

    this.logger.log('update spot > success');
  }

  // FIXME: Corrigir
  @Get('/schedules/availability')
  @HttpCode(HttpStatus.OK)
  async availability(
    @Param('establishmentId', ParseUUIDPipe) establishmentId: UUID,
    @Query('date', DateQueryParam) date: string,
  ) {
    this.logger.log('list spots availability > params', { establishmentId });

    const output = await this.getSpotsAvailability.execute({
      establishmentId,
      date,
    });

    if (!output.isOk) {
      this.logger.error('retrieve spots availability > fail', {
        error: output.value,
      });
      throw output.value;
    }

    this.logger.log('list spots availability > success', output);

    return output.value;
  }
}
