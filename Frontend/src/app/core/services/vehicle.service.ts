import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDto } from '../../shared/models/vehicle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) { }

  getByUserId(userId: number): Observable<VehicleDto> {
    return this.http.get<VehicleDto>(`${this.apiUrl}/user/${userId}`);
  }
}
