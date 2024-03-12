import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class PartnerRegister {
  @ApiProperty({ example: 'Arena XR' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'arena-xr' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'comercial@arenaxr.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '(88)981434688',
    description: 'Phone number with DDD',
  })
  @IsPhoneNumber('BR')
  @IsMobilePhone('pt-BR')
  phone: string;

  @ApiProperty({ example: '12312312312312' })
  @IsString()
  cnpj: string;

  @IsOptional()
  picture: string = '';
}
