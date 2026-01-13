import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FriendRequest } from '../models/notification.model';

export interface FriendRequestStatus {
  id: number;
  receiverId: number;
  receiverFirstName: string;
  receiverLastName: string;
  status: string;
  updatedAt: string;
}

export interface Friend {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  facultyName: string;
}

export interface FriendshipStatus {
  status: 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED';
  isSender: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  sendFriendRequest(receiverId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-request`, { receiverId });
  }

  getFriendCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/friends/count`);
  }

  getPendingFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/pending`);
  }

  acceptFriendRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-requests/${requestId}/accept`, {});
  }

  declineFriendRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-requests/${requestId}/decline`, {});
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus[]> {
    return this.http.get<FriendRequestStatus[]>(`${this.apiUrl}/friend-requests/status`);
  }

  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.apiUrl}/friends`);
  }

  getFriendshipStatus(otherUserId: number): Observable<FriendshipStatus> {
    return this.http.get<FriendshipStatus>(`${this.apiUrl}/friendship/${otherUserId}`);
  }
}
