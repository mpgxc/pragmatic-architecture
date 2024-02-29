import { AttributeValue, QueryInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { entityFactory } from '@common/helpers';
import { OptionalPromise } from '@common/logic';
import { OutputList, Repository } from '@common/types';
import { Schedule } from '@domain/schedule/schedule';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UUID, randomUUID } from 'node:crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';
import { DynamoCommand, Pagination } from '../dynamo/types';

@Injectable()
export class ScheduleRepository {
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  bind = (spotId?: UUID) =>
    new RepositoryActions(this.config, this.client, spotId);
}

@Injectable()
export class RepositoryActions
  extends ExtraRepositoryMethods
  implements Partial<Repository<Schedule>>
{
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
    private readonly spotId: UUID,
  ) {
    super();
  }

  async create(props: Schedule): Promise<void> {
    const scheduleId = randomUUID();

    const content = entityFactory<Schedule>({
      PK: `SCHEDULE#${scheduleId}`,
      SK: `SPOT#${props.spotId}`,
      Content: {
        ...props,
        scheduleId,
      },
    });

    await this.client.create({
      Item: marshall(content, { convertClassInstanceToMap: true }),
    });
  }

  async get(id: UUID): OptionalPromise<Schedule> {
    console.log({ id });
    return null;
  }

  async list(pagination: Pagination): Promise<OutputList<Schedule>> {
    const { sort, limit, page } = pagination || {};

    // Filtrar agendamentos do dia 2024-02-22, independente do spot
    const command: DynamoCommand<QueryInput> = {
      IndexName: 'SK-index',
      KeyConditionExpression: '#SK = :SK',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      FilterExpression: 'begins_with(#PK, :PK)',
      ExpressionAttributeValues: marshall({
        ':PK': 'SCHEDULE#',
        ':SK': `SPOT#${this.spotId}`,
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
      Items: Items.map((item) => this.dynamoItemMapper<Schedule>(item)),
      LastEvaluatedKey: this.extractCurrentPage(LastEvaluatedKey) || '',
      Count,
    };
  }

  async update(id: UUID, payload: Partial<Schedule>): Promise<void> {
    console.log({ id, payload });
  }

  async getSchedulesByDate(date: string): Promise<Schedule[]> {
    const command: DynamoCommand<QueryInput> = {
      IndexName: 'SK-index',
      KeyConditionExpression: '#SK = :SK',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#Date': 'date',
        '#SK': 'SK',
      },
      FilterExpression: 'begins_with(#PK, :PK) AND Content.#Date = :Date',
      ExpressionAttributeValues: marshall({
        ':PK': 'SCHEDULE#',
        ':Date': date,
        ':SK': `SPOT#${this.spotId}`,
      }),
    };

    const { Items } = await this.client.query(command);
    return Items.map((item) => this.dynamoItemMapper<Schedule>(item));
  }

  async getSchedulesAtEstablishmentByDate(
    date: string,
    establishmentId: string,
  ): Promise<Schedule[]> {
    const { Items } = await this.client.query({
      IndexName: 'SK-index',
      KeyConditionExpression: '#SK = :SK',
      FilterExpression: 'begins_with(#PK, :PK)',
      ExpressionAttributeValues: marshall({
        ':SK': `ESTABLISHMENT#${establishmentId}`,
        ':PK': `SPOT#`,
      }),
      ExpressionAttributeNames: {
        '#SK': 'SK',
        '#PK': 'PK',
      },
      ProjectionExpression: 'PK',
    });

    if (!Items) return [];

    const spots = Items.map(unmarshall as never) as {
      PK: string;
    }[];

    const aggregates: Record<string, AttributeValue>[] = [];

    for (const { PK } of spots) {
      const { Items } = await this.client.query({
        IndexName: 'SK-index',
        KeyConditionExpression: '#SK = :SK',
        FilterExpression: 'begins_with(#PK, :PK) AND Content.#Date = :date',
        ExpressionAttributeValues: marshall({
          ':PK': 'SCHEDULE#',
          ':SK': PK,
          ':date': date,
        }),
        ExpressionAttributeNames: {
          '#Date': 'date',
          '#PK': 'PK',
          '#SK': 'SK',
        },
      });

      aggregates.push(...Items);
    }

    return aggregates.map((item) => this.dynamoItemMapper<Schedule>(item));
  }
}
