import { Module } from '@nestjs/common';
import { DynamoRepositoryService } from './dynamo/dynamo-repository.service';
import { DynamoDBClientService } from './dynamo/dynamo.service';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { PartnerRepository } from './repositories/partner.repository';

@Module({
  providers: [
    DynamoDBClientService,
    DynamoRepositoryService,
    /**
     * Repositories
     */
    EstablishmentRepository,
    PartnerRepository,
  ],
  exports: [EstablishmentRepository, PartnerRepository],
})
export class DatabaseModule {}
