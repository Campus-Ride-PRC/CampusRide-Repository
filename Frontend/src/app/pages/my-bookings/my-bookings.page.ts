import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonCard, IonCardContent, IonButton,
  IonIcon, IonSpinner, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { BookingService } from 'src/app/core/services/booking.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingResponse, BookingStatus, BookingRole } from 'src/app/core/models/booking.model';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  carOutline, locationOutline, timeOutline, cashOutline,
  closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
  mailOutline, chatbubbleEllipsesOutline
} from 'ionicons/icons';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { Profile } from 'src/app/core/services/profile';
import { UserResponse } from 'src/app/core/models/userResponse';
import { FriendService } from 'src/app/core/services/friend.service';
import { DriveService } from 'src/app/core/services/drive.service';
@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard, IonCardContent, IonButton,
    IonIcon, IonSpinner,
    CommonModule, FormsModule,
    AppHeaderComponent, SidePanelComponent, IonCardHeader, IonCardTitle
  ]
})
export class MyBookingsPage implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  BookingStatus = BookingStatus;
  isPanelOpen = false;
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private profileService: Profile,
    private friendService: FriendService,
    private driveService: DriveService
  ) {
    addIcons({
      carOutline, locationOutline, timeOutline, cashOutline,
      closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
      mailOutline, chatbubbleEllipsesOutline
    });
  }

  ngOnInit() {
    this.loadBookings();
    this.loadUser();
    this.loadFriendCount();
    this.loadRidesCount();
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

  loadBookings() {
    this.loading = true;
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings
          .filter(booking => booking.role === BookingRole.CLIENT)
          .sort((a, b) => {
            const statusOrder: Record<BookingStatus, number> = {
              PENDING: 1,
              ACCEPTED: 2,
              DECLINED: 3,
              CANCELED: 4
            };
            return statusOrder[a.status] - statusOrder[b.status];
          });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
      }
    });
  }

  loadRidesCount() {
    this.driveService.getMyDrivesCount().subscribe({
      next: (count) => {
        this.ridesCount = count;
      },
      error: (err) => {
        console.error('Error loading rides count:', err);
      }
    });
  }

  cancelBooking(booking: BookingResponse) {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking.driveId, userId).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error canceling booking:', error);
          let errorMessage = 'Failed to cancel booking. Please try again.';

          if (error.status === 409) {
            errorMessage = 'This booking cannot be canceled due to a conflict. It may have already been canceled or is in a state that cannot be changed.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Invalid booking cancellation request.';
          } else if (error.status === 404) {
            errorMessage = 'Booking not found. It may have been already removed.';
          }

          alert(errorMessage);
        }
      });
    }
  }

  canCancel(booking: BookingResponse): boolean {
    return booking.status === BookingStatus.PENDING || booking.status === BookingStatus.ACCEPTED;
  }

  viewRideDetails(driveId: number) {
    const userId = this.authService.getCurrentUserId();
    this.router.navigate(['/ride-details', driveId], {
      queryParams: { returnTo: 'my-bookings', userId: userId }
    });
  }

  contactDriver(booking: BookingResponse) {
    const userId = this.authService.getCurrentUserId();
    this.router.navigate(['/ride-details', booking.driveId], {
      queryParams: {
        returnTo: 'my-bookings',
        userId: userId,
        openChat: 'true'
      }
    });
  }

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.ACCEPTED: return 'success';
      case BookingStatus.DECLINED: return 'danger';
      case BookingStatus.CANCELED: return 'medium';
      default: return 'medium';
    }
  }

  getStatusBackgroundColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return '#ffa500';
      case BookingStatus.ACCEPTED: return '#00C36C';
      case BookingStatus.DECLINED: return '#eb445a';
      case BookingStatus.CANCELED: return '#666666';
      default: return '#666666';
    }
  }

  getStatusLabel(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'Pending Approval';
      case BookingStatus.ACCEPTED: return 'Booking Accepted';
      case BookingStatus.DECLINED: return 'Booking Declined';
      case BookingStatus.CANCELED: return 'Booking Canceled';
      default: return status;
    }
  }

  getStatusIcon(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'hourglass-outline';
      case BookingStatus.ACCEPTED: return 'checkmark-circle-outline';
      case BookingStatus.DECLINED:
      case BookingStatus.CANCELED: return 'close-circle-outline';
      default: return 'hourglass-outline';
    }
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

    switch (item) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'add-ride':
        this.router.navigate(['/add-drive']);
        break;
      case 'my-bookings':
        // Already on my-bookings
        break;
      case 'my-rides':
        this.router.navigate(['/my-rides']);
        break;
      case 'ride-requests':
        this.router.navigate(['/driver-requests']);
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
