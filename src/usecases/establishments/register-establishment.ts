import { Establishment } from '@domain/establishment/establishment';
import { EstablishmentRepository } from '@infra/database/repositories/establishment.repository';
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';

@Injectable()
export class RegisterEstablishment {
  constructor(private readonly repository: EstablishmentRepository) {}

  async execute(partnerId: UUID, props: Establishment) {
    await this.repository.bind(partnerId).create(props);
  }
}
