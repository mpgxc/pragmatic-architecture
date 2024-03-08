import { Address, Establishment } from '@domain/establishment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
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

export class EstablishmentRegister implements Establishment {
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
  @IsNotEmptyObject()
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
  @IsNotEmptyObject()
  hours: EstablishmentHours;

  @IsString()
  @ApiProperty({
    required: false,
  })
  description?: string;
}

export class EstablishmentUpdate implements Partial<Establishment> {
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
  name: string;
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

  @ApiProperty({ example: '5b268c50-ea8c-4133-a221-bc15e86ce965' })
  partnerId?: string;

  @ApiProperty({ example: '28b2fa8c-b305-41ce-a547-2c1c62617757' })
  establishmentId?: string;
}
