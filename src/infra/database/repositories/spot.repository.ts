import { UUID, randomUUID } from 'node:crypto';

import { Entity, OutputList, Repository } from '@common/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';

import { Spot } from '@domain/spot/spot';
import { entityFactory } from '@common/helpers';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoCommand, Pagination } from '../dynamo/types';
import { OptionalPromise } from '@common/logic';
import { QueryInput } from '@aws-sdk/client-dynamodb';

@Injectable()
export class SpotRepository {
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  bind = (establishmentId: UUID): Repository<Spot> =>
    new RepositoryActions(this.config, this.client, establishmentId);
}

@Injectable()
export class RepositoryActions
  extends ExtraRepositoryMethods
  implements Partial<Repository<Spot>>
{
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
    private readonly establishmentId: UUID,
  ) {
    super();
  }

  async create(props: Spot) {
    const spotId = randomUUID();

    const content = entityFactory<Spot>({
      PK: `SPOT#${spotId}`,
      SK: `ESTABLISHMENT#${props.establishmentId}`,
      Content: {
        ...props,
        spotId,
      },
    });

    await this.client.create({
      Item: marshall(content, { convertClassInstanceToMap: true }),
    });
  }

  async get(spotId: UUID): OptionalPromise<Entity<Spot>> {
    const { Item } = await this.client.find({
      Key: marshall({
        PK: `SPOT#${spotId}`,
        SK: `ESTABLISHMENT#${this.establishmentId}`,
      }),
    });

    return Item ? this.dynamoItemMapper<Spot>(Item) : undefined;
  }

  async list(pagination: Pagination): Promise<OutputList<Spot>> {
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
        ':PK': 'SPOT#',
        ':SK': `ESTABLISHMENT#${this.establishmentId}`,
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
      Items: Items.map((item) => this.dynamoItemMapper<Spot>(item)),
      LastEvaluatedKey: this.extractCurrentPage(LastEvaluatedKey) || '',
      Count,
    };
  }

  async update(spotId: UUID, payload: Partial<Spot>): Promise<void> {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = this.buildUpdate<Partial<Spot>>({
      path: 'Content',
      payload,
    });

    await this.client.update({
      Key: marshall({
        PK: `SPOT#${spotId}`,
        SK: `ESTABLISHMENT#${this.establishmentId}`,
      }),
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }
}
