import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute() {
    await this.repository.create();
  }
}
