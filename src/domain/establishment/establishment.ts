export type Address = {
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
};

export type Establishment = {
  owner: string;
  phone: string;
  cnpj: string;
  name: string;
  email: string;
  address: Address;
  rating?: number;
  pictures?: string[];
  description?: string;
  hours: {
    open: string;
    close: string;
  };
};
