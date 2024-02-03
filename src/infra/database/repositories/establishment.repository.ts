import { QueryInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { entityFactory } from '@common/helpers';
import { OptionalPromise } from '@common/logic';
import { Entity, OutputList, Repository } from '@common/types';
import { Establishment } from '@domain/establishment/establishment';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UUID, randomUUID } from 'node:crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';
import { DynamoCommand, Pagination } from '../dynamo/types';

@Injectable()
export class EstablishmentRepository {
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  bind = (partnerId: UUID) =>
    new RepositoryActions(this.config, this.client, partnerId);
}

class RepositoryActions
  extends ExtraRepositoryMethods
  implements Repository<Establishment>
{
  constructor(
    private readonly config: ConfigService, // 👈 Será utilizado na proxíma rc
    private readonly client: DynamoRepositoryService,
    private readonly partnerId: UUID,
  ) {
    super();
  }

  async create(props: Establishment) {
    const establishmentId = randomUUID();

    const content = entityFactory<Establishment>({
      PK: `ESTABLISHMENT#${establishmentId}`,
      SK: `PARTNER#${this.partnerId}`,
      Content: {
        ...props,
        partnerId: this.partnerId,
        establishmentId,
      },
    });

    await this.client.create({
      Item: marshall(content, {
        convertClassInstanceToMap: true,
      }),
    });
  }

  async get(establishmentId: UUID): OptionalPromise<Entity<Establishment>> {
    const { Item } = await this.client.find({
      Key: marshall({
        PK: `ESTABLISHMENT#${establishmentId}`,
        SK: `PARTNER#${this.partnerId}`,
      }),
    });

    return Item ? this.dynamoItemMapper<Establishment>(Item) : undefined;
  }

  async list(pagination: Pagination): Promise<OutputList<Establishment>> {
    {
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

      const { Limit, ExclusiveStartKey, ScanIndexForward } =
        this.applyPagination({
          sort,
          limit,
          page,
        });

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
  }

  async update(establishmentId: UUID, payload: Partial<Establishment>) {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = this.buildUpdate<Partial<Establishment>>({
      path: 'Content',
      payload,
    });

    await this.client.update({
      Key: marshall({
        PK: `ESTABLISHMENT#${establishmentId}`,
        SK: `PARTNER#${this.partnerId}`,
      }),
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }
}
