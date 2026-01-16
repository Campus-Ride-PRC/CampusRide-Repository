export interface BookingRequest {
  driveId: number;
  userId: number;
  pickupAddressId?: number;
}

export interface BookingResponse {
  driveId: number;
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  driverEmail: string;
  driverFirstName: string;
  driverLastName: string;
  fromLocationName: string;
  toLocationName: string;
  status: BookingStatus;
  role: BookingRole;
  requestedAt: string;
  updatedAt: string;
  driveTime: string;
  price: number;
  pickupAddress?: {
    id: number;
    street: string;
    number: string;
    locationName: string;
    neighborhood: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED'
}

export enum BookingRole {
  DRIVER = 'DRIVER',
  CLIENT = 'CLIENT'
}
