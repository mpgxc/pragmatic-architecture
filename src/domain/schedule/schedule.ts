type SpotSchedule = {
  name: string;
  modality: string;
};

type ScheduleLeader = {
  leaderId: string;
  leaderName: string;
};

type StatusChange = {
  at: Date;
  status: ScheduleStatus;
  reason?: string;
};

enum ScheduleStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

type Schedule = {
  scheduleId?: string;
  spotId: string;
  establishmentId?: string;
  partnerId: string;
  status: ScheduleStatus;
  starts: string;
  ends: string;
  totalValue: number;
  spot: SpotSchedule;
  leader: ScheduleLeader;
  statusChanges: StatusChange[];
};

export { Schedule, ScheduleStatus };
