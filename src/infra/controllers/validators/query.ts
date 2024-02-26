import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

const CURRENT_PAGE_REGEX = /^\{"PK":"[^"]+","SK":"[^"]+"\}$/;

export class QueryParams {
  @ApiProperty({
    required: false,
    minimum: 1,
    description: 'Number of products to return',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiProperty({
    required: false,
    enum: SortOrder,
    description: 'Sort order',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiProperty({
    required: false,
    description: 'Current page',
    example: '{"PK":"YOURPK#1","SK":"YOURSK#1"}',
  })
  @IsOptional()
  @IsString()
  @Matches(CURRENT_PAGE_REGEX, {
    message: 'Invalid current page, please use the correct format',
  })
  page?: string;
}

@Injectable()
export class DateQueryParam implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query' || metadata.data !== 'date') {
      return value;
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(value)) {
      throw new BadRequestException(
        'Invalid date format. Date should be in YYYY-MM-DD format.',
      );
    }

    return value;
  }
}
