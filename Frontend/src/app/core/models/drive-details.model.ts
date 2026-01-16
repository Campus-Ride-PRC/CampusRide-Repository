import { Address } from './address.model';

export interface DriveDetails {
  id: number;
  time: string;
  price: number;
  availableSeats: number;
  totalNoSeats: number;
  fromAddress: Address;
  toAddress: Address;
  driverId: number;
  driverFirstName: string;
  driverLastName: string;
  vehicleModel: string;
  vehicleLicencePlate: string;
  vehicleColor: string;
  acceptedPaymentTypes: string[];
}
