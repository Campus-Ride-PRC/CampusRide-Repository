import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { SidePanelComponent } from '../../shared/components/panel/side-panel.component';
import { Profile } from '../../core/services/profile';
import { UserResponse } from '../../core/models/userResponse';
import { AuthService } from '../../core/services/auth.service';
import { FriendService } from '../../core/services/friend.service';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.page.html',
  styleUrls: ['./communities.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, AppHeaderComponent, SidePanelComponent]
})
export class CommunitiesPage implements OnInit {
  readonly isPanelOpen = signal(false);
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  constructor(
    private profileService: Profile,
    private authService: AuthService,
    private router: Router,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadFriendCount();
  }

  private loadUserProfile() {
    this.profileService.getLoggedUser().subscribe({
      next: (response: UserResponse) => {
        this.user = response;
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}