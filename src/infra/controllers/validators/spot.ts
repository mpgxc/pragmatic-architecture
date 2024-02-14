import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty()
  @IsString()
  starts: string;

  @ApiProperty()
  @IsString()
  ends: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsBoolean()
  available: boolean;
}

export class WeekDaysRentSettings {
  @ApiProperty()
  @IsEnum(WeekDayEnum)
  weekday: WeekDayEnum;

  @ApiProperty({ type: [HourSettings] })
  @ValidateNested({ each: true })
  @Type(() => HourSettings)
  hours: HourSettings[];

  @ApiProperty()
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
