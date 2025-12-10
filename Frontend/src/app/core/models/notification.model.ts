import { BookingResponse, BookingStatus } from './booking.model';

export type NotificationType = 'request-sent' | 'request-received';

export interface Notification {
  id: string;
  type: NotificationType;
  timestamp: Date;
  booking: BookingResponse;
  // Additional properties for display
  title: string;
  subtitle: string;
  status?: BookingStatus;
}
