import { Address } from './address.model';

export interface DriveCreateRequest {
  fromAddress: Omit<Address, 'id'>;
  toAddress: Omit<Address, 'id'>;
  price: number;
  day: string;  // Format: YYYY-MM-DD
  hour: string; // Format: HH:MM:SS
  totalNoSeats: number;
  vehicleModel: string;
  vehicleLicencePlate: string;
  vehicleColor: string;
  userId: number;
  acceptedPaymentTypes: string[];
}
