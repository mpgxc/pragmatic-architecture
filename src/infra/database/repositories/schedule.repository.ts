import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { UUID, randomUUID } from 'crypto';
import { Entity, OutputList, Repository } from '@common/types';
import { Schedule } from '@domain/schedule/schedule';
import { ExtraRepositoryMethods } from '../dynamo/helpers';
import { OptionalPromise } from '@common/logic';
import { DynamoCommand, Pagination } from '../dynamo/types';
import { entityFactory } from '@common/helpers';
import { marshall } from '@aws-sdk/util-dynamodb';
import { QueryInput, ScanCommandInput } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ScheduleRepository {
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  bind = (spotId: UUID) =>
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
      Created: `${props.date}`,
      Content: {
        ...props,
        scheduleId,
      },
    });
    console.log({ content });

    await this.client.create({
      Item: marshall(content, { convertClassInstanceToMap: true }),
    });
  }

  async get(id: UUID): OptionalPromise<Entity<Schedule>> {
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
        '#Created': 'Created',
        '#SK': 'SK',
      },
      FilterExpression: 'begins_with(#PK, :PK) AND #Created = :Created',
      ExpressionAttributeValues: marshall({
        ':PK': 'SCHEDULE#',
        ':Created': date,
        ':SK': `SPOT#${this.spotId}`,
      }),
    };

    const { Items } = await this.client.query(command);
    return Items.map((item) => this.dynamoItemMapper<Schedule>(item).Content);
  }
}
