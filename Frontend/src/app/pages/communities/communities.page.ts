import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { SidePanelComponent } from '../../shared/components/panel/side-panel.component';
import { Profile } from '../../core/services/profile';
import { UserResponse } from '../../core/models/userResponse';
import { AuthService } from '../../core/services/auth.service';
import { FriendService } from '../../core/services/friend.service';
import { CommunityService } from '../../core/services/community.service';
import { Community } from 'src/app/core/models/community.model';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.page.html',
  styleUrls: ['./communities.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, AppHeaderComponent, SidePanelComponent, FormsModule]
})
export class CommunitiesPage implements OnInit {
  readonly isPanelOpen = signal(false);
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  userCommunities: Community[] = [];
  newCommunities: Community[] = [];
  
  showAddModal: boolean = false;
  newCommunityName: string = '';
  newCommunityDescription: string = '';
  showSuccessAnimation: boolean = false;
  createdCommunityId: number | null = null;
  
  showJoinModal: boolean = false;
  selectedCommunityId: number | null = null;
  selectedCommunityName: string = '';
  
  showDetailsModal: boolean = false;
  selectedCommunity: Community | null = null;

  constructor(
    private profileService: Profile,
    private authService: AuthService,
    public router: Router,
    private friendService: FriendService,
    private communityService: CommunityService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.loadFriendCount();
  }

  private loadUserProfile() {
    this.profileService.getLoggedUser().subscribe({
      next: (response: UserResponse) => {
        this.user = response;
        // Load communities after user is loaded
        this.loadUserCommunities();
        this.loadNewCommunities();
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadFriendCount() {
    this.friendService.getFriendCount().subscribe({
      next: (count) => {
        this.friendsCount = count;
      },
      error: (err) => {
        console.error('Error loading friend count:', err);
      }
    });
  }

  loadUserCommunities() {
    if (!this.user) return;
    
    this.communityService.getUserCommunities(this.user.id).subscribe({
      next: (communities) => {
        this.userCommunities = communities;
        console.log('User communities loaded:', communities);
      },
      error: (err) => {
        console.error('Error loading user communities:', err);
      }
    });
  }

  loadNewCommunities() {
    if (!this.user) return;
    
    this.communityService.getNewCommunities(this.user.id).subscribe({
      next: (communities) => {
        this.newCommunities = communities;
        console.log('New communities loaded:', communities);
      },
      error: (err) => {
        console.error('Error loading new communities:', err);
      }
    });
  }

  togglePanel() {
    this.isPanelOpen.set(!this.isPanelOpen());
    this.loadFriendCount();
  }

  closePanel() {
    this.isPanelOpen.set(false);
  }

  onMenuItemClick(itemId: string) {
    console.log('Menu item clicked:', itemId);
    
    switch(itemId) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'add-ride':
        this.router.navigate(['/add-drive']);
        break;
      case 'my-bookings':
        this.router.navigate(['/my-bookings']);
        break;
      case 'my-rides':
        this.router.navigate(['/my-rides']);
        break;
      case 'ride-requests':
        this.router.navigate(['/driver-requests']);
        break;
      case 'friends':
        this.router.navigate(['/friends']);
        break;
      case 'settings':
        console.log('Settings feature coming soon');
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'communities':
        // Already on communities
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  onAddCommunity() {
    console.log('Add new community clicked');
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newCommunityName = '';
    this.newCommunityDescription = '';
  }

  createCommunity() {
    if (!this.newCommunityName.trim()) {
      console.error('Community name is required');
      return;
    }

    if (!this.user) {
      console.error('User not loaded');
      return;
    }

    this.communityService.createCommunity(this.newCommunityName, this.newCommunityDescription, this.user.id).subscribe({
      next: (community) => {
        console.log('Community created:', community);
        this.createdCommunityId = community.id;
        
        // Show success animation
        this.showSuccessAnimation = true;
        
        // After animation, redirect to community page
        setTimeout(() => {
          this.showSuccessAnimation = false;
          this.closeAddModal();
          this.router.navigate(['/communities', community.id]);
          // Reload communities lists
          this.loadUserCommunities();
        }, 2450);
      },
      error: (err) => {
        console.error('Error creating community:', err);
        // TODO: Show error message
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  joinCommunity(communityId: number) {
    console.log('Joining community:', communityId);
    // TODO: Implement join community API call
    // For now, just navigate to the community page
    this.router.navigate(['/communities', communityId]);
  }

  showJoinConfirmation(communityId: number, communityName: string) {
    this.selectedCommunityId = communityId;
    this.selectedCommunityName = communityName;
    this.showJoinModal = true;
  }

  cancelJoin() {
    this.showJoinModal = false;
    this.selectedCommunityId = null;
    this.selectedCommunityName = '';
  }

  confirmJoin() {
    if (this.selectedCommunityId) {
      this.joinCommunity(this.selectedCommunityId);
    }
    this.cancelJoin();
  }

  showCommunityDetails(community: Community) {
    this.selectedCommunity = community;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedCommunity = null;
  }

  getMockMemberCount(): number {
    // Mock data - random member count between 10-500
    return Math.floor(Math.random() * 490) + 10;
  }

  joinFromDetails() {
    if (this.selectedCommunity) {
      this.closeDetailsModal();
      this.showJoinConfirmation(this.selectedCommunity.id, this.selectedCommunity.name);
    }
  }
}