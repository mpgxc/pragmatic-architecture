import { QueryInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { entityFactory } from '@common/helpers';
import { Establishment } from '@domain/establishment/establishment';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';
import { DynamoCommand, Pagination } from '../dynamo/types';

@Injectable()
export class EstablishmentRepository extends ExtraRepositoryMethods {
  // Deve ser recebido via parâmetro
  private partnerId = '34d5b513-aea9-47c7-b501-96307f81f0b7';

  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    super();
    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  async create(props: Establishment) {
    const id = randomUUID();

    const content = entityFactory<Establishment>({
      PK: `ESTABLISHMENT#${id}`,
      SK: `PARTNER#${this.partnerId}`,
      Content: { ...props, id },
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

  async get(id: string) {
    const { Item } = await this.client.find({
      Key: marshall({
        PK: `ESTABLISHMENT#${id}`,
        SK: `PARTNER#${this.partnerId}`,
      }),
    });

    return Item ? this.dynamoItemMapper(Item) : undefined;
  }

  async list(pagination: Pagination) {
    const { sort, limit, page } = pagination || {};

    const command: DynamoCommand<QueryInput> = {
      IndexName: 'SK-index',
      KeyConditionExpression: '#SK = :SK',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      FilterExpression: 'begins_with(#PK, :PK)',
      ExpressionAttributeValues: marshall({
        ':PK': 'ESTABLISHMENT#',
        ':SK': `PARTNER#${this.partnerId}`,
      }),
    };

    const { Limit, ExclusiveStartKey, ScanIndexForward } = this.applyPagination(
      {
        sort,
        limit,
        page,
      },
    );

    const { Items, LastEvaluatedKey, Count } = await this.client.query({
      ...command,
      Limit,
      ScanIndexForward,
      ExclusiveStartKey,
      ReturnConsumedCapacity: 'TOTAL',
    });

    return {
      Items: Items.map((item) => this.dynamoItemMapper<Establishment>(item)),
      LastEvaluatedKey: this.extractCurrentPage(LastEvaluatedKey) || '',
      Count,
    };
  }

  async update(id: string, { name, phone, owner }: Partial<Establishment>) {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = this.buildUpdate<Partial<Establishment>>({
      path: 'Content',
      payload: {
        name,
        phone,
        owner,
      },
    });

    await this.client.update({
      Key: marshall({
        PK: `ESTABLISHMENT#${id}`,
        SK: `PARTNER#${this.partnerId}`,
      }),
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }
}
