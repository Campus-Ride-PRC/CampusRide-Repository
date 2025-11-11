import { Address } from "./address.model";

export interface Faculty {
  id: number;
  name: string;
  address: Address | null;
}
