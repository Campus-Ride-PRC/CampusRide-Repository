import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserResponse} from "../models/userResponse";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DriveCard} from "../models/drive-card.model";
import {BookingResponse} from "../models/booking.model";



@Injectable({
  providedIn: 'root',
})
export class Profile {
  constructor(private http: HttpClient) {

  }

  private apiUrl = `${environment.apiUrl}/user/me`;
  private driverURL = `${environment.apiUrl}/drives/my-drives`;
  getLoggedUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.apiUrl);

  }
  getDrives() : Observable<DriveCard[]> {
    return this.http.get<DriveCard[]>(this.driverURL);
  }
  getBookings(): Observable<BookingResponse[]>{
    return this.http.get<BookingResponse[]>(`${environment.apiUrl}/bookings/my-bookings`);
  }
}
