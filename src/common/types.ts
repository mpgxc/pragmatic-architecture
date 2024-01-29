export type Entity<Content = any> = {
  PK: string;
  SK: string;
  Content: Content;
  Updated?: string;
  Created: string;
  Status?: string;
};
