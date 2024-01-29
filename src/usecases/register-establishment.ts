import { Establishment } from '@domain/establishment/establishment';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(props: Establishment) {
    await this.repository.create(props);
  }
}
