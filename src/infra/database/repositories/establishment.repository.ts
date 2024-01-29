import { marshall } from '@aws-sdk/util-dynamodb';
import { entityFactory } from '@common/helpers';
import { Establishment } from '@domain/establishment/establishment';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';

@Injectable()
export class EstablishmentRepository {
  // Deve ser recebido via parâmetro
  private partnerId = '34d5b513-aea9-47c7-b501-96307f81f0b7';

  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  async create(props: Establishment) {
    const content = entityFactory<Establishment>({
      PK: `ESTABLISHMENT#${randomUUID()}`,
      SK: `PARTNER#${this.partnerId}`,
      Content: { ...props },
      Status: 'Ativo',
    });

    /*
    // Talvez
    const addressContent = entityFactory({
      PK: content.PK,
      SK: 'ADDRESS',
      Content: { ...address },
    });
    */

    await this.client.create({
      Item: marshall(content, {
        convertClassInstanceToMap: true,
      }),
    });
  }
}
