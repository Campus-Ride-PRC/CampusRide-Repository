import { BookingResponse, BookingStatus } from './booking.model';
import { FriendRequestStatus } from '../services/friend.service';

export type NotificationType = 'request-sent' | 'request-received' | 'friend-request-received' | 'friend-request-status';

export interface FriendRequest {
  id: number;
  senderId: number;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  sentAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  timestamp: Date;
  booking?: BookingResponse;
  friendRequest?: FriendRequest;
  friendRequestStatus?: FriendRequestStatus;
  // Additional properties for display
  title: string;
  subtitle: string;
  status?: BookingStatus | string;
}
