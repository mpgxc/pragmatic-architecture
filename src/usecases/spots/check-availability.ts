import { Injectable } from '@nestjs/common';

type CheckAvailabilityInput = {
  establishmentId: string;
  date: string;
};

type Hour = {
  starts: string;
  ends: string;
  price: number;
  isRented: boolean;
};

type CheckAvailabilityOutput = {
  spotId: string;
  spotName: string;
  hours: Hour[];
};

@Injectable()
export class CheckAvailability {
  constructor() {}

  async execute(
    input: CheckAvailabilityInput,
  ): Promise<CheckAvailabilityOutput> {
    return {
      spotId: '123',
      spotName: input.establishmentId,
      hours: [{ ends: '18:00', starts: '17:00', isRented: false, price: 120 }],
    };
  }
}
