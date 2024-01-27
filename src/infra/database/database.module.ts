import { Module } from '@nestjs/common';
import { DynamoRepositoryService } from './dynamo/dynamo-repository.service';
import { DynamoDBClientService } from './dynamo/dynamo.service';
import { EstablishmentRepository } from './repositories/establishment.repository';

@Module({
  providers: [
    DynamoDBClientService,
    DynamoRepositoryService,
    /**
     * Repositories
     */
    EstablishmentRepository,
  ],
  exports: [EstablishmentRepository],
})
export class DatabaseModule {}
