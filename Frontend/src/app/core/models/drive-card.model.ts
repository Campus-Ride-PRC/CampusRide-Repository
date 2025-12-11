import { Address } from './address.model';

export interface DriveCard {
  id: number;
  time: string;
  price: number;
  availableSeats: number;
  totalNoSeats: number;
  fromAddress: Address;
  toAddress: Address;
  driverFirstName: string;
  driverLastName: string;
  vehicleModel: string;
}

export interface DriveCardPage {
  content: DriveCard[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}

