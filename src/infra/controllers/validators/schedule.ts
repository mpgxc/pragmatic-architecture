import {
  IsUUID,
  IsDateString,
  IsString,
  ValidateNested,
  Matches,
  IsNotEmptyObject,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UUID } from 'crypto';

const TIME_REGEX = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/;

class ScheduleLeader {
  @ApiProperty({ example: 'Mary', description: 'Name of the leader' })
  @IsString()
  leaderName: string;

  @ApiProperty({
    example: 'b88d1613-ea5f-4b47-8573-e4d97e9df2bc',
    description: 'UUID of the leader',
  })
  @IsUUID('4', { message: 'Invalid UUID format' })
  leaderId: string;
}

class ScheduleTime {
  @ApiProperty({
    example: '18:00',
    description: 'Start time of the schedule in HH:mm format',
  })
  @Matches(TIME_REGEX, {
    message: 'Invalid time format. Time should be in HH:mm format.',
  })
  start: string;

  @ApiProperty({
    example: '19:00',
    description: 'End time of the schedule in HH:mm format',
  })
  @Matches(TIME_REGEX, {
    message: 'Invalid time format. Time should be in HH:mm format.',
  })
  end: string;
}

export class CreateSchedule {
  @ApiProperty({
    example: 'b88d1613-ea5f-4b47-8573-e4d97e9df2bc',
    description: 'UUID of the spot',
  })
  @IsUUID('4', { message: 'Invalid UUID format' })
  spotId: UUID;

  @ApiProperty({
    example: 'b024c522-545b-4d4e-964e-130b92c3fb8e',
    description: 'UUID of the establishment',
  })
  @IsUUID('4', { message: 'Invalid UUID format' })
  establishmentId: UUID;

  @ApiProperty({
    example: '2024-03-01',
    description: 'Date of the schedule in YYYY-MM-DD format',
  })
  @IsDateString(
    { strict: true },
    { message: 'Invalid date format. Date should be in YYYY-MM-DD format.' },
  )
  date: string;

  @ApiProperty({ type: ScheduleLeader, description: 'Lider do agendamento' })
  @Type(() => ScheduleLeader)
  @ValidateNested({ each: true, always: true })
  @IsNotEmptyObject()
  leader: ScheduleLeader;

  @ApiProperty({
    type: ScheduleTime,
    description: 'Horário que seram agendados',
    isArray: true,
  })
  @Type(() => ScheduleTime)
  @ValidateNested({ each: true, always: true })
  @IsArray()
  scheduleTimes: ScheduleTime[];
}
