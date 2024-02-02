export type Address = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
};

export type Establishment = {
  id?: string;
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
