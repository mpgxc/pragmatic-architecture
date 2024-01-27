import { marshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';

@Injectable()
export class EstablishmentRepository {
  private partnerId = '34d5b513-aea9-47c7-b501-96307f81f0b7';

  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  async create() {
    await this.client.create({
      Item: marshall({
        PK: 'PARTNER#' + this.partnerId,
        SK: 'ESTABLISHMENT#' + randomUUID(),
        Content: {
          name: 'Estabelecimento 1',
          description: 'Estabelecimento 1',
          address: 'Rua 1',
          number: '123',
          neighborhood: 'Bairro 1',
          city: 'Cidade 1',
          state: 'Estado 1',
          country: 'País 1',
          zipCode: '12345678',
          phone: '12345678',
        },
        Createed: new Date().toISOString(),
        Status: 'ACTIVE',
      }),
    });
  }
}
