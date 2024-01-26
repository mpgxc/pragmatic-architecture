import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class DynamoDBClientService
  extends DynamoDBClient
  implements OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      endpoint: config.getOrThrow('AWS_URL'),
      region: config.getOrThrow('AWS_REGION'),
    });
  }

  onModuleDestroy() {
    this.destroy();
  }
}
