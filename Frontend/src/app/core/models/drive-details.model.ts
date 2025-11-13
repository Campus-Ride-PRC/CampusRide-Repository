export interface DriveDetails {
  id: number;
  time: string;
  price: number;
  availableSeats: number;
  totalNoSeats: number;
  fromLocationName: string;
  fromNeighborhood: string;
  toLocationName: string;
  toNeighborhood: string;
  driverFirstName: string;
  driverLastName: string;
  vehicleModel: string;
  vehicleLicencePlate: string;
  vehicleColor: string;
}
