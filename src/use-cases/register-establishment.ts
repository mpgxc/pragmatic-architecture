import { Injectable } from '@nestjs/common';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';

@Injectable()
export class RegisterEstablishment {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  async execute() {
    await this.establishmentRepository.create();
  }
}
