import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonButton,
  IonIcon, IonBadge, IonSpinner, IonButtons,
  IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { BookingService } from 'src/app/core/services/booking.service';
import { DriveService } from 'src/app/core/services/drive.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingResponse, BookingStatus } from 'src/app/core/models/booking.model';
import { Notification, FriendRequest } from 'src/app/core/models/notification.model';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  carOutline, locationOutline, timeOutline, cashOutline,
  closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
  mailOutline, personCircleOutline, notificationsOffOutline,
  paperPlaneOutline, personAddOutline
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { Profile } from 'src/app/core/services/profile';
import { UserResponse } from 'src/app/core/models/userResponse';
import { FriendService, FriendRequestStatus } from 'src/app/core/services/friend.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard, IonCardContent, IonButton,
    IonIcon, IonSpinner,
    IonRefresher, IonRefresherContent,
    CommonModule, FormsModule,
    AppHeaderComponent, SidePanelComponent
  ]
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  BookingStatus = BookingStatus;
  isPanelOpen = false;
  user: UserResponse | null = null;
  friendsCount: number = 0;
  ridesCount: number = 0;

  constructor(
    private bookingService: BookingService,
    private driveService: DriveService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private profileService: Profile,
    private friendService: FriendService
  ) {
    addIcons({
      carOutline, locationOutline, timeOutline, cashOutline,
      closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
      mailOutline, personCircleOutline, notificationsOffOutline,
      paperPlaneOutline, personAddOutline
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
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const myBookings$ = this.bookingService.getBookingsByUser(userId);
    const driverDrives$ = this.driveService.getDrivesByDriver(userId);
    const friendRequests$ = this.friendService.getPendingFriendRequests();
    const friendRequestStatus$ = this.friendService.getFriendRequestStatus();

    forkJoin([myBookings$, driverDrives$, friendRequests$, friendRequestStatus$]).subscribe({
      next: ([myBookings, driverDrives, friendRequests, friendRequestStatus]) => {
        const receivedRequests$ = driverDrives.map(drive =>
          this.bookingService.getPendingBookingsByDrive(drive.id)
        );

        if (receivedRequests$.length > 0) {
          forkJoin(receivedRequests$).subscribe({
            next: (receivedBookingsArrays) => {
              const flattenedReceivedBookings = receivedBookingsArrays.reduce((acc, val) => acc.concat(val), []);
              this.processNotifications(myBookings, flattenedReceivedBookings, friendRequests, friendRequestStatus, event);
            },
            error: (error) => {
              console.error('Error loading received bookings:', error);
              this.processNotifications(myBookings, [], friendRequests, friendRequestStatus, event);
            }
          });
        } else {
          this.processNotifications(myBookings, [], friendRequests, friendRequestStatus, event);
        }
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  private processNotifications(
    myBookings: BookingResponse[],
    receivedBookings: BookingResponse[],
    friendRequests: FriendRequest[],
    friendRequestStatus: FriendRequestStatus[],
    event?: any
  ) {
    const sentNotifications = this.transformBookingsToSentNotifications(myBookings);
    const receivedNotifications = this.transformBookingsToReceivedNotifications(receivedBookings);
    const friendRequestNotifications = this.transformFriendRequestsToNotifications(friendRequests);
    const friendRequestStatusNotifications = this.transformFriendRequestStatusToNotifications(friendRequestStatus);

    this.notifications = [...sentNotifications, ...receivedNotifications, ...friendRequestNotifications, ...friendRequestStatusNotifications]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.loading = false;
    if (event) event.target.complete();
  }

  private transformBookingsToSentNotifications(bookings: BookingResponse[]): Notification[] {
    return bookings.map(booking => ({
      id: `sent-${booking.driveId}-${booking.userId}`,
      type: 'request-sent',
      timestamp: new Date(booking.updatedAt),
      booking: booking,
      title: `Your request for ride from ${booking.fromLocationName} to ${booking.toLocationName} has been ${booking.status.toLowerCase()}`,
      subtitle: `Driver: ${booking.driverFirstName} ${booking.driverLastName}`,
      status: booking.status
    }));
  }

  private transformBookingsToReceivedNotifications(bookings: BookingResponse[]): Notification[] {
    return bookings.map(booking => ({
      id: `received-${booking.driveId}-${booking.userId}`,
      type: 'request-received',
      timestamp: new Date(booking.requestedAt),
      booking: booking,
      title: `${booking.userFirstName} wants to join your ride from ${booking.fromLocationName} to ${booking.toLocationName}`,
      subtitle: 'Tap to see more details',
    }));
  }

  private transformFriendRequestsToNotifications(requests: FriendRequest[]): Notification[] {
    return requests.map(request => ({
      id: `friend-${request.id}`,
      type: 'friend-request-received',
      timestamp: new Date(request.sentAt),
      friendRequest: request,
      title: 'New Friend Request',
      subtitle: `${request.senderFirstName} ${request.senderLastName} sent you a friend request`,
    }));
  }

  private transformFriendRequestStatusToNotifications(statuses: FriendRequestStatus[]): Notification[] {
    return statuses.map(status => ({
      id: `friend-status-${status.id}`,
      type: 'friend-request-status',
      timestamp: new Date(status.updatedAt),
      friendRequestStatus: status,
      title: `Friend Request ${status.status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
      subtitle: `${status.receiverFirstName} ${status.receiverLastName} has ${status.status.toLowerCase()} your friend request`,
      status: status.status
    }));
  }

  acceptBooking(booking: BookingResponse) {
    this.bookingService.acceptBooking(booking.driveId, booking.userId).subscribe({
      next: () => this.loadData(),
      error: (error) => {
        console.error('Error accepting booking:', error);
        alert('Failed to accept booking.');
      }
    });
  }

  acceptFriendRequest(request: FriendRequest) {
    this.friendService.acceptFriendRequest(request.id).subscribe({
      next: () => {
        this.loadData();
        this.loadFriendCount(); // Refresh friend count
      },
      error: (error) => {
        console.error('Error accepting friend request:', error);
        alert('Failed to accept friend request.');
      }
    });
  }

  declineFriendRequest(request: FriendRequest) {
    this.friendService.declineFriendRequest(request.id).subscribe({
      next: () => this.loadData(),
      error: (error) => {
        console.error('Error declining friend request:', error);
        alert('Failed to decline friend request.');
      }
    });
  }

  getStatusBackgroundColor(status: BookingStatus | string): string {
    if (typeof status === 'string') {
      switch (status) {
        case 'ACCEPTED': return '#00C36C';
        case 'DECLINED': return '#eb445a';
        default: return '#666666';
      }
    }
    switch (status) {
      case BookingStatus.PENDING: return '#ffa500';
      case BookingStatus.ACCEPTED: return '#00C36C';
      case BookingStatus.DECLINED: return '#eb445a';
      case BookingStatus.CANCELED: return '#666666';
      default: return '#666666';
    }
  }

  getStatusLabel(status: BookingStatus | string): string {
    if (typeof status === 'string') {
      switch (status) {
        case 'ACCEPTED': return 'Accepted';
        case 'DECLINED': return 'Declined';
        default: return status;
      }
    }
    switch (status) {
      case BookingStatus.PENDING: return 'Pending Approval';
      case BookingStatus.ACCEPTED: return 'Request Accepted';
      case BookingStatus.DECLINED: return 'Request Declined';
      case BookingStatus.CANCELED: return 'Request Canceled';
      default: return status;
    }
  }

  declineBooking(booking: BookingResponse) {
    if (confirm('Are you sure you want to decline this booking request?')) {
      this.bookingService.declineBooking(booking.driveId, booking.userId).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error declining booking:', error);
          alert('Failed to decline booking.');
        }
      });
    }
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
    // Already on notifications
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
