import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  requestRide(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/request`, request);
  }

  acceptBooking(driveId: number, userId: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${driveId}/${userId}/accept`, {});
  }

  declineBooking(driveId: number, userId: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${driveId}/${userId}/decline`, {});
  }

  cancelBooking(driveId: number, userId: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${driveId}/${userId}/cancel`, {});
  }

  getBookingsByDrive(driveId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/drive/${driveId}`);
  }

  getBookingsByUser(userId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  getPendingBookingsByDrive(driveId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/drive/${driveId}/pending`);
  }

  getBooking(driveId: number, userId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${driveId}/${userId}`);
  }
}
