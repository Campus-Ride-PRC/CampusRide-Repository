import { Address } from './address.model';

export interface DriveDetails {
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
  vehicleLicencePlate: string;
  vehicleColor: string;
}
