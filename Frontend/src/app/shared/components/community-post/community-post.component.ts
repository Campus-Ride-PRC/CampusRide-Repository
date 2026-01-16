import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityPost } from '../../../core/models/community-post.model';
import { CommunityComment } from '../../../core/models/community-comment.model';
import { CommunityCommentService } from '../../../core/services/community-comment.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CommunityPostComponent implements OnInit {
  @Input() post!: CommunityPost;
  
  comments: CommunityComment[] = [];
  showComments = false;
  newCommentContent = '';
  isLoadingComments = false;
  isSubmittingComment = false;

  constructor(
    private commentService: CommunityCommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Load comments automatically when post is initialized
    if (this.post && this.post.commentCount > 0) {
      this.loadComments();
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments && this.comments.length === 0) {
      this.loadComments();
    }
  }

  loadComments() {
    this.isLoadingComments = true;
    this.commentService.getCommentsByPost(this.post.id).subscribe({
      next: (comments) => {
        // Ensure all createdAt are Date objects
        this.comments = comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date()
        }));
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('❌ Error loading comments:', error);
        this.isLoadingComments = false;
      }
    });
  }

  submitComment() {
    if (!this.newCommentContent.trim()) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('❌ User not authenticated');
      return;
    }

    this.isSubmittingComment = true;
    this.commentService.createComment(
      this.post.id,
      this.newCommentContent.trim(),
      currentUser
    ).subscribe({
      next: (newComment) => {
        // Ensure createdAt is a Date object
        if (newComment.createdAt) {
          newComment.createdAt = new Date(newComment.createdAt);
        } else {
          newComment.createdAt = new Date();
        }
        this.comments.push(newComment);
        this.post.commentCount++;
        this.newCommentContent = '';
        this.isSubmittingComment = false;
        this.showComments = true;
      },
      error: (error) => {
        console.error('❌ Error creating comment:', error);
        this.isSubmittingComment = false;
      }
    });
  }

  getUserAvatar(firstName: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return postDate.toLocaleDateString();
  }

  getFullName(author: any): string {
    return `${author.firstName} ${author.lastName}`;
  }
}
