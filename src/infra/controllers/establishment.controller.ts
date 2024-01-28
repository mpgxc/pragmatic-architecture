import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterEstablishment } from '@usecases/register-establishment';

@ApiTags('Establishments')
@Controller('establishments')
export class EstablishmentController {
  constructor(
    @LoggerInject(EstablishmentController.name)
    private readonly logger: LoggerService,
    private readonly usecase: RegisterEstablishment,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The establishment has been successfully registered.',
  })
  async handle() {
    await this.usecase.execute();

    this.logger.log('Establishment registered');
  }
}
