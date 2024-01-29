import { Entity } from './types';

export const entityFactory = <T>({
  PK,
  SK,
  Content,
  ...extra
}: Omit<Entity, 'Created'>): Entity<T> => ({
  PK,
  SK,
  Content,
  ...extra,
  Created: new Date().toISOString(),
  Updated: extra.Updated || new Date().toISOString(),
});
