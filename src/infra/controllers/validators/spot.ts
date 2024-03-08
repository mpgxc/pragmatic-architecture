import { Spot } from '@domain/spot';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

enum WeekDayEnum {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export class HourSettings {
  @ApiProperty({ example: false, description: 'Define se é um horário nobre' })
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    example: '18:00',
    description: 'Hora de início. Deve ser no formato HH:mm',
  })
  @IsString()
  starts: string;

  @ApiProperty({
    example: '19:00',
    description: 'Hora de fim. Deve ser no formato HH:mm',
  })
  @IsString()
  ends: string;

  @ApiProperty({ example: 90, description: 'Valor dessa hora em reais' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: true,
    description: 'Marca o horário como disponível para agendamento',
  })
  @IsBoolean()
  available: boolean;
}

export class WeekDaysRentSettings {
  @ApiProperty({
    example: WeekDayEnum.Monday,
    examples: [0, 1, 2, 3, 4, 5, 6],
    description: 'Dia da semana. [0 -> Domingo, 1 -> Segunda...]',
  })
  @IsEnum(WeekDayEnum)
  weekday: WeekDayEnum;

  @ApiProperty({ type: [HourSettings] })
  @ValidateNested({ each: true })
  @Type(() => HourSettings)
  hours: HourSettings[];

  @ApiProperty({
    example: true,
    description: 'Marca esse dia da semana como disponível para agendamentos',
  })
  @IsBoolean()
  available: boolean;
}

export class SpotRegister {
  @ApiProperty({ example: 'Quadra A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Poliesportiva' })
  @IsString()
  modality: string;

  @ApiProperty({ type: [WeekDaysRentSettings] })
  @ValidateNested({ each: true })
  @Type(() => WeekDaysRentSettings)
  rentSettings: WeekDaysRentSettings[];
}

export class SpotUpdate {
  @ApiProperty({ example: 'Quadra D' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Society' })
  @IsString()
  modality: string;
}

export class SpotOutput implements Spot {
  @ApiProperty({ example: 'Quadra A' })
  name: string;

  @ApiProperty({ example: 'Poliesportiva' })
  modality: string;

  @ApiProperty({ example: '5b268c50-ea8c-4133-a221-bc15e86ce965' })
  partnerId?: string;

  @ApiProperty({ example: '28b2fa8c-b305-41ce-a547-2c1c62617757' })
  establishmentId?: string;

  @ApiProperty({ example: 'fd1bcdce-2fb1-4bb1-a7cf-07220f2feea2' })
  spotId?: string;

  @ApiProperty({ type: [WeekDaysRentSettings] })
  @ValidateNested({ each: true })
  @Type(() => WeekDaysRentSettings)
  rentSettings: WeekDaysRentSettings[];
}
