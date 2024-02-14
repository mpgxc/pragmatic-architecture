import { Module } from '@nestjs/common';
import { DynamoRepositoryService } from './dynamo/dynamo-repository.service';
import { DynamoDBClientService } from './dynamo/dynamo.service';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { PartnerRepository } from './repositories/partner.repository';
import { SpotRepository } from './repositories/spot.repository';

@Module({
  providers: [
    DynamoDBClientService,
    DynamoRepositoryService,
    /**
     * Repositories
     */
    EstablishmentRepository,
    PartnerRepository,
    SpotRepository,
  ],
  exports: [EstablishmentRepository, PartnerRepository, SpotRepository],
})
export class DatabaseModule {}
