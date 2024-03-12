export type Hour = {
  isPremium: boolean;
  starts: string;
  ends: string;
  price: number;
  available: boolean;
};

export type WeekDaysRentSettings = {
  weekday: number;
  hours: Hour[];
  available: boolean;
};

export type WeekDay =
  | 'weekday_0'
  | 'weekday_1'
  | 'weekday_2'
  | 'weekday_3'
  | 'weekday_4'
  | 'weekday_5'
  | 'weekday_6';

export type RentSettings = Record<WeekDay, WeekDaysRentSettings>;

export type Spot = {
  name: string;
  modality: string;
  rentSettings?: WeekDaysRentSettings[];
  partnerId?: string;
  establishmentId?: string;
  spotId?: string;
};
