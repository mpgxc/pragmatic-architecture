import { Spot } from '@domain/spot/spot';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SpotRegister implements Spot {
  @ApiProperty({ example: 'Quadra A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Poliesportiva' })
  @IsString()
  modality: string;
}
