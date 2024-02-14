import { Partner } from '@domain/partner/partner';

declare global {
  namespace Express {
    interface Request {
      partner: Partner;
    }
  }
}
