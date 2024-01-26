import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBClientService } from '../dynamo/dynamo.service';

@Injectable()
export class EstablishmentRepository {
  constructor(private readonly client: DynamoDBClientService) {}

  async create() {
    const putCommand = new PutItemCommand({
      TableName: 'PartnertEstablishments',
      Item: { ID: { S: uuid() }, Name: { S: 'Quadra do palmeiral' } },
    });

    await this.client.send(putCommand);
  }
}
