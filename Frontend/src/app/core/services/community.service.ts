import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Community } from '../models/community.model';
import { UserResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = `${environment.apiUrl}/communities`;

  constructor(private http: HttpClient) { }

  getUserCommunities(user: UserResponse): Observable<Community[]> {
    return this.http.post<Community[]>(`${this.apiUrl}/user-communities`, user);
  }

  getNewCommunities(user: UserResponse): Observable<Community[]> {
    return this.http.post<Community[]>(`${this.apiUrl}/new-communities`, user);
  }

  createCommunity(name: string, description: string): Observable<Community> {
    return this.http.post<Community>(`${this.apiUrl}/create`, { name, description });
  }
}
