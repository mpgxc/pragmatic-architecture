import { ConflictException, Injectable } from '@nestjs/common';

import { PartnerRepository } from '@infra/database/repositories/partner.repository';
import { Ok, Result } from '@common/logic';

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
    const alreadyExists = await this.repository.exists(input.cnpj);

    if (alreadyExists) {
      return Result.Err(
        new ConflictException('Already exists a partner with same CNPJ'),
      );
    }

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
