import { Injectable } from '@nestjs/common';

import { SpotRepository } from '@infra/database/repositories/spot.repository';
import { Spot } from '@domain/spot/spot';

@Injectable()
export class RegisterSpot {
  constructor(private readonly repository: SpotRepository) {}

  async execute(input: Spot) {
    // TODO: Verificar se ainda é possível adicionar nova quadra para esse estabelecimento

    await this.repository.create(input);
  }
}
