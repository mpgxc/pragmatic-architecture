export type DynamoItem<T = any> = {
  PK: string;
  SK: string;
  Content: T;
  Created: string;
  Status: string;
};

export type Pagination = {
  sort: 'ASC' | 'DESC';
  page?: string | undefined;
  limit: number;
};
