export interface DriveCreateRequest {
  fromStreet: string;
  fromNumber: string;
  fromNeighborhood: string;
  fromLocationName: string;
  toStreet: string;
  toNumber: string;
  toNeighborhood: string;
  toLocationName: string;
  price: number;
  day: string;  // Format: YYYY-MM-DD
  hour: string; // Format: HH:MM:SS
  availableSeats: number;
  totalNoSeats: number;
  vehicleModel: string;
  vehicleLicencePlate: string;
  vehicleColor: string;
  userId: number;
}
