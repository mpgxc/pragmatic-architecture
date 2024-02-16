import { Injectable } from '@nestjs/common';

import { PartnerRepository } from '@infra/database/repositories/partner.repository';
import { Ok } from '@common/logic';

type RegisterPartnerInput = {
  name: string;
  slug: string;
  email: string;
  phone: string;
  cnpj: string;
  picture: string;
};

@Injectable()
export class RegisterPartner {
  constructor(private readonly repository: PartnerRepository) {}

  async execute(input: RegisterPartnerInput) {
    // Check if exists by CNPJ

    await this.repository.create({
      cnpj: input.cnpj,
      email: input.email,
      name: input.name,
      phone: input.phone,
      picture: input.picture,
      slug: input.slug,
    });

    return Ok();
  }
}
