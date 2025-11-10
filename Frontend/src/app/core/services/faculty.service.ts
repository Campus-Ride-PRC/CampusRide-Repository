import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../models/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = 'http://localhost:8080/api/faculties';

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }
}
