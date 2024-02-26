import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  UpdateItemInput,
  paginateQuery,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoDBClientService } from './dynamo.service';
import { DynamoCommand } from './types';

@Injectable()
export class DynamoRepositoryService {
  private TableName!: string;

  constructor(private readonly client: DynamoDBClientService) {}

  setTableName(name: string) {
    this.TableName = name;

    return this;
  }

  async queryPaginator(params: DynamoCommand<QueryCommandInput>): Promise<
    QueryCommandOutput & {
      Attemps: number;
    }
  > {
    const paginator = paginateQuery(
      {
        client: this.client,
      },
      {
        ...params,
        TableName: this.TableName,
      },
    );

    const Items: Record<string, AttributeValue>[] = [];
    let Attemps = 0;

    for await (const page of paginator) {
      Items.push(...page.Items!);
      Attemps += 1;
    }

    return {
      Items,
      Count: Items.length,
      Attemps,
    } as QueryCommandOutput & {
      Attemps: number;
    };
  }

  async query(
    params: DynamoCommand<QueryCommandInput>,
  ): Promise<QueryCommandOutput> {
    return this.client.send(
      new QueryCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async find(
    params: DynamoCommand<GetItemCommandInput>,
  ): Promise<GetItemCommandOutput> {
    return this.client.send(
      new GetItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async create(
    params: DynamoCommand<PutItemCommandInput>,
  ): Promise<GetItemCommandOutput> {
    return this.client.send(
      new PutItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async update(
    params: DynamoCommand<UpdateItemInput>,
  ): Promise<UpdateItemCommandOutput> {
    return this.client.send(
      new UpdateItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async scan(
    params: DynamoCommand<ScanCommandInput>,
  ): Promise<ScanCommandOutput> {
    return this.client.send(
      new ScanCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }
}
