import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommunityPost } from '../models/community-post.model';
import { UserResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root'
})
export class CommunityPostService {
  private apiUrl = `${environment.apiUrl}/communities/posts`;

  constructor(private http: HttpClient) { }

  getPostsByCommunity(communityId: number): Observable<CommunityPost[]> {
    return this.http.get<CommunityPost[]>(`${this.apiUrl}/${communityId}`);
  }

  createPost(communityId: number, content: string, author: UserResponse): Observable<CommunityPost> {
    return this.http.post<CommunityPost>(this.apiUrl, {
      communityId,
      content,
      author
    });
  }
}
