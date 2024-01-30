import { Address, Establishment } from '@domain/establishment/establishment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EstablishmentAddress {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  street: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  number: string;

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

export class EstablishmentInput implements Establishment {
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
  @Type(() => EstablishmentAddress)
  @ValidateNested({
    each: true,
    always: true,
  })
  address: EstablishmentAddress;

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

export class EstablishmentOutput implements Establishment {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    type: EstablishmentAddress,
  })
  address: Address;

  @ApiProperty()
  rating?: number;

  @ApiProperty()
  pictures?: string[];

  @ApiProperty()
  description?: string;

  @ApiProperty({
    type: EstablishmentHours,
  })
  hours: {
    open: string;
    close: string;
  };
}
