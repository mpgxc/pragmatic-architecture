import { Entity } from './types';

export const entityFactory = <T>({
  PK,
  SK,
  Content,
  ...extra
}: Partial<Entity<T>>): Entity<T> => ({
  PK,
  SK,
  Content,
  Created: extra.Created || new Date().toISOString(),
  Updated: extra.Updated || new Date().toISOString(),
  Status: 'Ativo',
});
