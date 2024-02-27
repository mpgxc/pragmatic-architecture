import { PartnerRepository } from '@infra/database/repositories/partner.repository';
import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PartnerMiddleware implements NestMiddleware {
  constructor(private readonly repository: PartnerRepository) {}

  async use(request: Request, _: Response, next: NextFunction) {
    const partnerId = request.params?.['partnerId'] as UUID;

    await new ParseUUIDPipe().transform(partnerId, {
      type: 'param',
      data: partnerId,
    });

    const partner = await this.repository.get(partnerId);

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    request.partner = partner.Content;

    return next();
  }
}
