import { marshall } from '@aws-sdk/util-dynamodb';
import { entityFactory } from '@common/helpers';
import { OptionalPromise } from '@common/logic';
import { Entity, Repository } from '@common/types';
import { Partner } from '@domain/partner/partner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UUID, randomUUID } from 'node:crypto';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';

@Injectable()
export class PartnerRepository
  extends ExtraRepositoryMethods
  implements Partial<Repository<any>>
{
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    super();

    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
  }

  /**
   * @TODO: esse método será refatorado para receber os dados do parceiro
   */
  async create(props: Partner) {
    const partnerId = randomUUID();

    const content = entityFactory<Partner>({
      PK: `PARTNER#${partnerId}`,
      SK: `PROFILE#${props.cnpj}`,
      Content: {
        ...props,
        partnerId,
      },
    });

    await this.client.create({
      Item: marshall(content, {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }),
    });
  }

  async get(partnerId: UUID): OptionalPromise<Entity<Partner>> {
    const { Items } = await this.client.query({
      KeyConditionExpression: '#PK = :PK AND begins_with(#SK, :SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':PK': `PARTNER#${partnerId}`,
        ':SK': 'PROFILE#',
      }),
      Limit: 1,
    });

    const [Item] = Items;

    return Item ? this.dynamoItemMapper<Partner>(Item) : null;
  }

  async exists(cnpj: string) {
    const { Items } = await this.client.query({
      IndexName: 'SK-index',
      KeyConditionExpression: '#SK = :SK',
      ExpressionAttributeNames: {
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':SK': `PROFILE#${cnpj}`,
      }),
    });

    return Items.length > 0;
  }
}
