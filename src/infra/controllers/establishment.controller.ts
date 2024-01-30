import { LoggerInject, LoggerService } from '@mpgxc/logger';
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import {
  EstablishmentInput,
  EstablishmentOutput,
} from './validators/establishment';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { QueryParams } from './validators/query';

@ApiTags('Establishments')
@Controller('establishments')
export class EstablishmentController {
  constructor(
    @LoggerInject(EstablishmentController.name)
    private readonly logger: LoggerService,
    private readonly registerEstablishment: RegisterEstablishment,
    private readonly getEstablishment: GetEstablishment,
    private readonly listEstablishments: ListEstablishments,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The establishment has been successfully registered.',
  })
  async create(@Body() payload: EstablishmentInput): Promise<void> {
    this.logger.log('create > params', {
      payload,
    });

    await this.registerEstablishment.execute(payload);

    this.logger.log('create > success');
  }

  @Get('/:id')
  @ApiOkResponse({ type: EstablishmentOutput })
  @ApiOkResponse()
  async getById(@Param('id') id: string) {
    const output = await this.getEstablishment.execute(id);

    return output;
  }

  @Get('')
  @ApiOkResponse({ type: EstablishmentOutput, isArray: true })
  async list(@Query() { limit, sort, page }: QueryParams) {
    const output = await this.listEstablishments.execute({
      pagination: { limit, sort, page },
    });

    return output;
  }
}
