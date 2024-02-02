export type Entity<Content = any> = {
  PK: string;
  SK: string;
  Content: Content;
  Updated?: string;
  Created: string;
  Status?: string;
};

export type AddressInfo = {
  logradouro: string;
  prefix_logradouro: string;
  municipio: string;
  uf: string;
  cep: string;
  complemento: string;
  bairro: string;
  numero: string;
};
