import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriveCardPage } from '../models/drive-card.model';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private apiUrl = `${environment.apiUrl}/drives`;

  constructor(private http: HttpClient) {}

  getDriveCards(page: number = 0, size: number = 10): Observable<DriveCardPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<DriveCardPage>(`${this.apiUrl}/cards`, { params });
  }
}

