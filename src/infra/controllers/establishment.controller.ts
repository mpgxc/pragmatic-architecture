import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { EstablishmentInput } from './validators/establishment';

@ApiTags('Establishments')
@Controller('establishments')
export class EstablishmentController {
  constructor(
    @LoggerInject(EstablishmentController.name)
    private readonly logger: LoggerService,
    private readonly registerEstablishment: RegisterEstablishment,
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
}
