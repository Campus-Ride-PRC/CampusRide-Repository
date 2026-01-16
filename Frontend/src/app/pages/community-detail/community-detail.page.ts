import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { CommunityService } from '../../core/services/community.service';
import { CommunityPostService } from '../../core/services/community-post.service';
import { AuthService } from '../../core/services/auth.service';
import { Community } from '../../core/models/community.model';
import { CommunityPost } from '../../core/models/community-post.model';
import { CommunityPostComponent } from '../../shared/components/community-post/community-post.component';

@Component({
  selector: 'app-community-detail',
  templateUrl: './community-detail.page.html',
  styleUrls: ['./community-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, AppHeaderComponent, CommunityPostComponent]
})
export class CommunityDetailPage implements OnInit {
  communityId: string | null = null;
  community: Community | null = null;
  posts: CommunityPost[] = [];
  isLoading = false;
  
  // Add Post Modal
  showAddPostModal = false;
  newPostContent = '';
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private postService: CommunityPostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.communityId = this.route.snapshot.paramMap.get('id');
    console.log('Community ID:', this.communityId);
    
    // Check if community data was passed via navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;
    
    if (state?.['community']) {
      this.community = state['community'];
      console.log('✅ Community from navigation state:', this.community);
    } else if (this.communityId) {
      console.log('⚠️ No community in state, would fetch from backend');
    }

    // Load posts
    if (this.communityId) {
      this.loadPosts();
    }
  }

  loadPosts() {
    if (!this.communityId) return;
    
    this.isLoading = true;
    this.postService.getPostsByCommunity(parseInt(this.communityId)).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        console.log('✅ Posts loaded:', posts);
      },
      error: (error) => {
        console.error('❌ Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }

  openAddPostModal() {
    this.showAddPostModal = true;
    this.newPostContent = '';
  }

  closeAddPostModal() {
    this.showAddPostModal = false;
    this.newPostContent = '';
  }

  submitPost() {
    if (!this.newPostContent.trim() || !this.communityId) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('❌ User not authenticated');
      return;
    }

    this.isSubmitting = true;
    this.postService.createPost(
      parseInt(this.communityId),
      this.newPostContent.trim(),
      currentUser
    ).subscribe({
      next: (newPost) => {
        console.log('✅ Post created:', newPost);
        this.isSubmitting = false;
        this.closeAddPostModal();
        // Reload posts to show the new one
        this.loadPosts();
      },
      error: (error) => {
        console.error('❌ Error creating post:', error);
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/communities']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
