import { Result } from '@common/logic';
import { Partner as RegisterPartnerInput } from '@domain/partner';
import { PartnerRepository } from '@infra/database/repositories/partner.repository';
import { LoggerService } from '@mpgxc/logger';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class RegisterPartner {
  constructor(
    private readonly logger: LoggerService,
    private readonly repository: PartnerRepository,
  ) {}

  async execute(data: RegisterPartnerInput) {
    try {
      const exists = await this.repository.exists(data.cnpj);

      if (exists) {
        this.logger.warn(
          `Already exists a partner with same CNPJ: ${data.cnpj}`,
        );

        return Result.Err(
          new ConflictException('Already exists a partner with same CNPJ'),
        );
      }

      await this.repository.create(data);

      this.logger.log(`Partner ${data.name} created successfully`);

      return Result.Ok();
    } catch (error) {
      this.logger.error(
        `An unexpected error occurred - ${(error as Error).message}`,
      );

      return Result.Err(
        new InternalServerErrorException({
          name: 'UnexpectedError',
          message: `An unexpected error occurred - ${(error as Error).message}`,
        }),
      );
    }
  }
}
