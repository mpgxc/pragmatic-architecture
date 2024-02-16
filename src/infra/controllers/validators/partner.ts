import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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

  @ApiProperty({ example: '88981434688' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '12312312312312' })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: 'picture.png' })
  @IsString()
  picture: string;
}
