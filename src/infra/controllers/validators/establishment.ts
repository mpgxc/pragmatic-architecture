import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Address {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  street: string;

  @IsNumber()
  @ApiProperty({
    required: true,
  })
  number: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  complement?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  zipcode: string;
}

export class EstablishmentHours {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  open: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  close: string;
}

export class EstablishmentInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  owner: string;

  @IsPhoneNumber('BR')
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  cnpj: string;

  @ApiProperty({
    required: true,
  })
  @Type(() => Address)
  @ValidateNested({
    each: true,
    always: true,
  })
  address: Address;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name: string;

  @ApiProperty({
    required: true,
  })
  @Type(() => EstablishmentHours)
  @ValidateNested({
    each: true,
    always: true,
  })
  hours: EstablishmentHours;

  @IsString()
  @ApiProperty({
    required: false,
  })
  description?: string;
}
