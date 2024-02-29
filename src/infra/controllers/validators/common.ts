import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const ApiFileUpload = (fieldName: string) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );

class CommonData {
  @ApiProperty({ example: 'Ativo' })
  status: string;

  @ApiProperty({ example: '2024-02-28T00:12:30.789Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-02-28T00:12:30.789Z' })
  updatedAt: string;
}

class Paginator<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  Items: T[];

  @ApiProperty({ example: '{"PK":"YOURPK#1","SK":"YOURSK#1"}' })
  @IsString()
  LastEvaluatedKey: string;

  @ApiProperty({ example: 1 })
  Count: number;
}

/**
 * @param type Define o model
 * @param paginated Se true, define uma response paginada onde os Items serão um array do tipo Model passado
 */
type ApiPaginatedResponseProps<Model> = {
  type: Model;
  paginated?: boolean;
};

/**
 * Custom decorator para transformar outputs de responses paginadas ou não
 */
export const ApiResponse = <TModel extends Type<any>>({
  type,
  paginated = false,
}: ApiPaginatedResponseProps<TModel>) => {
  const schema = paginated
    ? {
        allOf: [
          { $ref: getSchemaPath(Paginator) },
          {
            properties: {
              Items: {
                type: 'array',
                items: {
                  allOf: [
                    { $ref: getSchemaPath(CommonData) },
                    { $ref: getSchemaPath(type) },
                  ],
                },
              },
            },
          },
        ],
      }
    : {
        allOf: [
          { $ref: getSchemaPath(CommonData) },
          { $ref: getSchemaPath(type) },
        ],
      };

  return applyDecorators(
    ApiExtraModels(Paginator, CommonData, type),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema,
    }),
  );
};
