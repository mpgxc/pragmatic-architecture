import { ScheduleStatus } from '@domain/schedule/schedule';
import { ScheduleRepository } from '@infra/database/repositories/schedule.repository';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateSchedule {
  constructor(private readonly repository: ScheduleRepository) {}

  async execute() {
    await this.repository.bind('83edad6d-35f0-429c-b046-f33363bbd40e').create({
      starts: '18:00',
      ends: '19:00',
      date: '2024-02-22',
      leader: { leaderId: '123123', leaderName: 'Deusimar' },
      partnerId: 'c48cb0b4-7927-4aee-addc-2f81b4e74314',
      spot: { modality: 'poliesportiva', name: 'Quadra A' },
      spotId: '83edad6d-35f0-429c-b046-f33363bbd40e',
      status: ScheduleStatus.CREATED,
      statusUpdates: [{ at: new Date(), status: ScheduleStatus.CREATED }],
      totalValue: 100,
      establishmentId: 'aaed57d1-0d65-4491-8ca0-f214fe8fc68a',
      scheduleId: randomUUID(),
    });
  }
}
