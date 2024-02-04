import { LoggerInject, LoggerService } from '@mpgxc/logger';
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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';
import { UUID } from 'node:crypto';
import {
  EstablishmentOutput,
  EstablishmentRegister,
  EstablishmentUpdate,
} from './validators/establishment';
import { QueryParams } from './validators/query';

@ApiTags('Establishments')
@Controller('partner/:partnerId/establishment')
export class EstablishmentController {
  constructor(
    @LoggerInject(EstablishmentController.name)
    private readonly logger: LoggerService,
    private readonly getEstablishment: GetEstablishment,
    private readonly listEstablishments: ListEstablishments,
    private readonly updateEstablishment: UpdateEstablishment,
    private readonly registerEstablishment: RegisterEstablishment,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The establishment has been successfully registered.',
  })
  async create(
    @Param('partnerId') partnerId: UUID,
    @Body() payload: EstablishmentRegister,
  ): Promise<void> {
    this.logger.log('create > params', {
      payload,
    });

    await this.registerEstablishment.execute(partnerId, payload);

    this.logger.log('create  > success');
  }

  @Get('/:establishmentId')
  @ApiOkResponse({ type: EstablishmentOutput })
  @HttpCode(HttpStatus.OK)
  async retrieve(
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId') establishmentId: UUID,
  ) {
    this.logger.log('retrieve > params', {
      partnerId,
      establishmentId,
    });

    const output = await this.getEstablishment.execute(
      partnerId,
      establishmentId,
    );

    this.logger.log('retrieve > success', output);

    return output;
  }

  @Get()
  @ApiOkResponse({
    type: [EstablishmentOutput],
  })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('partnerId') partnerId: UUID,
    @Query() { limit, sort, page }: QueryParams,
  ) {
    this.logger.log('list > params', { partnerId });

    const output = await this.listEstablishments.execute(partnerId, {
      pagination: {
        limit,
        sort,
        page,
      },
    });

    this.logger.log('list > success', output);

    return output;
  }

  @Put('/:establishmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The establishment has been successfully updated',
  })
  async update(
    @Body() payload: EstablishmentUpdate,
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId', ParseUUIDPipe) establishmentId: UUID,
  ) {
    this.logger.log('update > params ', {
      partnerId,
      establishmentId,
      payload,
    });

    await this.updateEstablishment.execute(partnerId, establishmentId, payload);

    this.logger.log('update > success');
  }
}
