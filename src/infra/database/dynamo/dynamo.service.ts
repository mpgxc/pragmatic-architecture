import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBClientService
  extends DynamoDBClient
  implements OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      region: config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  onModuleInit() {
    return this;
  }

  onModuleDestroy() {
    this.destroy();
  }
}
