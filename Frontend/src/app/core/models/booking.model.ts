export interface BookingRequest {
  driveId: number;
  userId: number;
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
