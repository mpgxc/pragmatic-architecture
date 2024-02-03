import { Entity } from '@common/types';

export type DynamoItem<T> = Entity<T>;

export type Pagination = {
  sort: 'ASC' | 'DESC';
  page?: string | undefined;
  limit: number;
};

export type DynamoCommand<T> = Omit<T, 'TableName'>;
