import { UUID } from 'node:crypto';

import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
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

import { SpotRegister, SpotUpdate } from './validators/spot';

import { RegisterSpot } from '@usecases/spots/register-spot';
import { GetSpot } from '@usecases/spots/get-spot';
import { QueryParams } from './validators/query';
import { ListSpots } from '@usecases/spots/list-spots';
import { UpdateSpot } from '@usecases/spots/update-spot';

@ApiTags('Spots')
@Controller('partner/:partnerId/establishment/:establishmentId/spots')
export class SpotController {
  constructor(
    private readonly logger: LoggerService,
    private readonly registerSpot: RegisterSpot,
    private readonly getSpot: GetSpot,
    private readonly listSpots: ListSpots,
    private readonly updateSpot: UpdateSpot,
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
    @Param('spotId', ParseUUIDPipe) spotId: UUID,
    @Param('establishmentId') establishmentId: UUID,
  ) {
    this.logger.log('retrieve spot > params', {
      spotId,
      establishmentId,
    });

    const output = await this.getSpot.execute({ establishmentId, spotId });

    this.logger.log('retrieve spot > success', output.value);

    return output.value;
  }

  @Get()
  @ApiOkResponse()
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

    await this.updateSpot.execute({
      modality: payload.modality,
      name: payload.name,
      establishmentId,
      spotId,
    });

    this.logger.log('update spot > success');
  }
}
