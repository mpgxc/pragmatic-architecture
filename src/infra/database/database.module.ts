import { Module } from '@nestjs/common';
import { DynamoDBClientService } from './dynamo/dynamo.service';
import { EstablishmentRepository } from './repositories/establishment.repository';

@Module({
  providers: [DynamoDBClientService, EstablishmentRepository],
  exports: [EstablishmentRepository],
})
export class DatabaseModule {}
