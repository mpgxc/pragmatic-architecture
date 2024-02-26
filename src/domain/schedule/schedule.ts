type SpotSchedule = {
  name: string;
  modality: string;
};

type ScheduleLeader = {
  leaderId: string;
  leaderName: string;
};

type StatusUpdate = {
  at: string;
  status: ScheduleStatus;
  reason?: string;
};

enum ScheduleStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

type ScheduleTime = {
  start: string;
  end: string;
  unitPrice?: number;
};

type Schedule = {
  scheduleId?: string;
  scheduleTimes?: ScheduleTime[];
  numberOfHours?: number;
  spotId: string;
  establishmentId?: string;
  partnerId: string;
  status: ScheduleStatus;
  date: string;
  totalValue: number;
  spot: SpotSchedule;
  leader: ScheduleLeader;
  statusUpdates: StatusUpdate[];
};

function calculateNumberOfHours(scheduleTimes: ScheduleTime[]) {
  return scheduleTimes.reduce((totalHours, time) => {
    const [startHour] = time.start.split(':');
    const [endHour] = time.end.split(':');

    return totalHours + (+endHour - +startHour);
  }, 0);
}

function calculateTotalValue(scheduleTimes: ScheduleTime[]) {
  return scheduleTimes.reduce((totalHours, time) => {
    const [startHour] = time.start.split(':');
    const [endHour] = time.end.split(':');

    return totalHours + (+endHour - +startHour);
  }, 0);
}

function sortScheduleTimes(scheduleTimes: ScheduleTime[]) {
  return scheduleTimes.sort((a, b) => {
    const [aHour] = a.start.split(':');
    const [bHour] = b.start.split(':');
    return +aHour - +bHour;
  });
}

function validateScheduleTimes(scheduleTimes: ScheduleTime[]) {
  if (scheduleTimes.length === 0) {
    return { isValid: false };
  }

  const sortedScheduleTimes = sortScheduleTimes(scheduleTimes);

  for (let i = 1; i < sortedScheduleTimes.length; i++) {
    const [prevHour] = sortedScheduleTimes[i - 1].start.split(':');
    const [currHour] = sortedScheduleTimes[i].start.split(':');

    if (!(+currHour === +prevHour + 1)) {
      return { isValid: false };
    }
  }

  return { isValid: true, sortedScheduleTimes };
}

export {
  Schedule,
  ScheduleStatus,
  validateScheduleTimes,
  calculateNumberOfHours,
  calculateTotalValue,
};
