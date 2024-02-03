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
import {
  EstablishmentOutput,
  EstablishmentRegister,
  EstablishmentUpdate,
} from './validators/establishment';
import { QueryParams } from './validators/query';

@ApiTags('Establishments')
@Controller('establishments')
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
  async create(@Body() payload: EstablishmentRegister): Promise<void> {
    this.logger.log('create > params', {
      payload,
    });

    await this.registerEstablishment.execute(payload);

    this.logger.log('create > success');
  }

  @Get('/:id')
  @ApiOkResponse({ type: EstablishmentOutput })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const output = await this.getEstablishment.execute(id);

    return output;
  }

  @Get()
  @ApiOkResponse({
    type: [EstablishmentOutput],
  })
  @HttpCode(HttpStatus.OK)
  async list(@Query() { limit, sort, page }: QueryParams) {
    const output = await this.listEstablishments.execute({
      pagination: { limit, sort, page },
    });

    return output;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The establishment has been successfully updated',
  })
  async update(
    @Body() payload: EstablishmentUpdate,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.logger.log('update establishment', { id });

    await this.updateEstablishment.execute(id, payload);

    this.logger.log('finish update establisment');
  }
}
