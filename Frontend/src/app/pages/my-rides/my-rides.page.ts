import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonIcon, IonSpinner, IonRefresher, IonRefresherContent, IonButton
} from '@ionic/angular/standalone';
import { DriveService } from 'src/app/core/services/drive.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriveCard } from 'src/app/core/models/drive-card.model';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { RideCardComponent } from 'src/app/shared/components/cards/ride-card.component';
import { Profile } from 'src/app/core/services/profile';
import { UserResponse } from 'src/app/core/models/userResponse';
import { FriendService } from 'src/app/core/services/friend.service';
import { addIcons } from 'ionicons';
import {
  carOutline, locationOutline, timeOutline, cashOutline, peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-my-rides',
  templateUrl: './my-rides.page.html',
  styleUrls: ['./my-rides.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonSpinner, IonRefresher, IonRefresherContent, IonButton,
    CommonModule, FormsModule,
    AppHeaderComponent, SidePanelComponent, RideCardComponent
  ]
})
export class MyRidesPage implements OnInit {
  myRides: DriveCard[] = [];
  loading = true;
  isPanelOpen = false;
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  constructor(
    private driveService: DriveService,
    private authService: AuthService,
    private router: Router,
    private profileService: Profile,
    private friendService: FriendService
  ) {
    addIcons({
      carOutline, locationOutline, timeOutline, cashOutline, peopleOutline
    });
  }

  ngOnInit() {
    this.loadMyRides();
    this.loadUser();
    this.loadFriendCount();
  }

  ionViewWillEnter() {
    this.loadMyRides();
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

  loadMyRides(event?: any) {
    this.loading = !event;
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.driveService.getDrivesByDriver(userId).subscribe({
      next: (drives) => {
        this.myRides = drives.sort((a, b) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading my rides:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLocationName(address: any): string {
    if (address.neighborhood && address.neighborhood.trim()) {
      return address.neighborhood;
    }

    const locationName = address.locationName;
    if (locationName && !this.looksLikeStreetNumber(locationName) && !locationName.includes(',')) {
      return locationName;
    }

    if (address.street && address.street.trim()) {
      return address.street;
    }

    return locationName || 'Unknown';
  }

  private looksLikeStreetNumber(text: string): boolean {
    return /^[\d\-\/]+$/.test(text.trim());
  }

  viewRideDetails(driveId: number) {
    this.router.navigate(['/ride-details', driveId], {
      queryParams: { driverMode: 'true' }
    });
  }

  handleRefresh(event: any) {
    this.loadMyRides(event);
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
    switch (item) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'add-ride':
        this.router.navigate(['/add-drive']);
        break;
      case 'my-bookings':
        this.router.navigate(['/my-bookings']);
        break;
      case 'ride-requests':
        this.router.navigate(['/driver-requests']);
        break;
      case 'my-rides':
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
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
