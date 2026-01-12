import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton,
  IonIcon, IonSpinner,
  IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonAvatar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, schoolOutline,
  notificationsOffOutline
} from 'ionicons/icons';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { Profile } from 'src/app/core/services/profile';
import { UserResponse } from 'src/app/core/models/userResponse';
import { FriendService, Friend } from 'src/app/core/services/friend.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon, IonSpinner,
    IonRefresher, IonRefresherContent,
    IonList, IonItem, IonLabel, IonAvatar,
    CommonModule, FormsModule,
    AppHeaderComponent, SidePanelComponent
  ]
})
export class FriendsPage implements OnInit {
  friends: Friend[] = [];
  loading = true;
  isPanelOpen = false;
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  constructor(
    private router: Router,
    private location: Location,
    private profileService: Profile,
    private friendService: FriendService
  ) {
    addIcons({
      personOutline, mailOutline, schoolOutline,
      notificationsOffOutline
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadUser();
    this.loadFriendCount();
  }

  loadUser() {
    this.profileService.getLoggedUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error loading user:', err);
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

  loadData(event?: any) {
    this.loading = !event;
    this.friendService.getFriends().subscribe({
      next: (friends) => {
        this.friends = friends;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.loadData(event);
  }

  goBack() {
    this.location.back();
  }

  onMenuOpen() {
    this.isPanelOpen = true;
    this.loadFriendCount();
  }

  onPanelClosed() {
    this.isPanelOpen = false;
  }

  onNotificationOpen() {
    this.router.navigate(['/notifications']);
  }

  onMenuItemClick(item: string) {
    console.log('Menu item clicked:', item);

    switch(item) {
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
        // Already on friends page
        break;
      case 'settings':
        console.log('Settings feature coming soon');
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  onRideClick(rideId: number) {
    this.router.navigate(['/ride-details', rideId], {
      queryParams: { driverMode: 'true' }
    });
  }

  logout() {
    // Implement logout logic
    this.router.navigate(['/welcome']);
  }
}
