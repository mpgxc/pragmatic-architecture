import { Controller, Post } from '@nestjs/common';
import { RegisterEstablishment } from './use-cases/register-establishment';

@Controller('establishments')
export class EstablishmentController {
  constructor(private readonly registerEstablishment: RegisterEstablishment) {}

  @Post()
  async handleRegister() {
    await this.registerEstablishment.execute();
  }
}
