import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriveCard, DriveCardPage } from '../models/drive-card.model';
import { DriveDetails } from '../models/drive-details.model';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private apiUrl = `${environment.apiUrl}/drives`;

  constructor(private http: HttpClient) {}

  getDriveCards(page: number = 0, size: number = 10, sort: string = 'time,asc'): Observable<DriveCardPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    return this.http.get<DriveCardPage>(this.apiUrl, { params });
  }

  getDriveById(id: number): Observable<DriveDetails> {
    return this.http.get<DriveDetails>(`${this.apiUrl}/${id}`);
  }

  getDrivesByDriver(driverId: number): Observable<DriveCard[]> {
    return this.http.get<DriveCard[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  getMyRecentRides(): Observable<DriveCard[]> {
    return this.http.get<DriveCard[]>(`${this.apiUrl}/my-recent-rides`);
  }

  getUpcomingDrives(page: number = 0, size: number = 10, sort: string = 'time,asc'): Observable<DriveCardPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    return this.http.get<DriveCardPage>(`${this.apiUrl}/upcoming`, { params });
  }

  addDrive(drive : any) : Observable<any> {
    return this.http.post<any>(this.apiUrl,drive);
  }
}

