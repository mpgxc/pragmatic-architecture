import { randomUUID } from 'node:crypto';

import { Repository } from '@common/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../dynamo/helpers';

import { Spot } from '@domain/spot/spot';
import { entityFactory } from '@common/helpers';
import { marshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class SpotRepository
  extends ExtraRepositoryMethods
  implements Partial<Repository<Spot>>
{
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    super();

    this.client.setTableName(this.config.getOrThrow('AWS_DYNAMODB_TABLE'));
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
}
