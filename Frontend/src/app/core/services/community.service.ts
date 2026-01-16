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

  getUserCommunities(userId: number): Observable<Community[]> {
    return this.http.get<Community[]>(`${this.apiUrl}/user-communities/${userId}`);
  }

  getNewCommunities(userId: number): Observable<Community[]> {
    return this.http.get<Community[]>(`${this.apiUrl}/new-communities/${userId}`);
  }

  createCommunity(name: string, description: string, creatorId: number): Observable<Community> {
    return this.http.post<Community>(`${this.apiUrl}/create`, { 
      name, 
      description, 
      creator: { id: creatorId } 
    });
  }

  joinCommunity(communityId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-member`, { 
      communityId, 
      userId 
    });
  }
}
