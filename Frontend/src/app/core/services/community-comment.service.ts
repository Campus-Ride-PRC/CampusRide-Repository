import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommunityComment } from '../models/community-comment.model';
import { UserResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root'
})
export class CommunityCommentService {
  private apiUrl = `${environment.apiUrl}/communities/comments`;

  constructor(private http: HttpClient) { }

  getCommentsByPost(postId: number): Observable<CommunityComment[]> {
    return this.http.get<CommunityComment[]>(`${this.apiUrl}/${postId}`);
  }

  createComment(postId: number, content: string, author: UserResponse): Observable<CommunityComment> {
    return this.http.post<CommunityComment>(this.apiUrl, {
      postId,
      content,
      author
    });
  }
}
