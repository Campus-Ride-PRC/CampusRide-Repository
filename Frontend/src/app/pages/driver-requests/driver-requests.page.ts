import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  IonIcon, IonBadge, IonSpinner, IonText, IonButtons, IonMenuButton,
  IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { BookingService } from 'src/app/core/services/booking.service';
import { DriveService } from 'src/app/core/services/drive.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingResponse, BookingStatus, BookingRole } from 'src/app/core/models/booking.model';
import { DriveCard } from 'src/app/core/models/drive-card.model';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  carOutline, locationOutline, timeOutline, cashOutline, 
  closeCircleOutline, checkmarkCircleOutline, personOutline,
  mailOutline
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { Profile } from 'src/app/core/services/profile';
import { UserResponse } from 'src/app/core/models/userResponse';
import { RedirectService } from 'src/app/core/services/redirect.service';

interface DriveWithBookings {
  drive: DriveCard;
  pendingBookings: BookingResponse[];
}

@Component({
  selector: 'app-driver-requests',
  templateUrl: './driver-requests.page.html',
  styleUrls: ['./driver-requests.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonBadge,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
    IonIcon, IonSpinner,
    IonRefresher, IonRefresherContent,
    CommonModule, FormsModule,
    AppHeaderComponent, SidePanelComponent
  ]
})
export class DriverRequestsPage implements OnInit {
  drivesWithBookings: DriveWithBookings[] = [];
  loading = true;
  BookingStatus = BookingStatus;
  isPanelOpen = false;
  user: UserResponse | null = null;

  constructor(
    private bookingService: BookingService,
    private driveService: DriveService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private profileService: Profile,
    private redirectService: RedirectService
  ) {
    addIcons({ 
      carOutline, locationOutline, timeOutline, cashOutline,
      closeCircleOutline, checkmarkCircleOutline, personOutline,
      mailOutline
    });
  }

  ngOnInit() {
    this.loadDriverRequests();
    this.loadUser();
  }

  ionViewWillEnter() {
    this.loadDriverRequests();
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

  loadDriverRequests(event?: any) {
    this.loading = !event;
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.driveService.getDrivesByDriver(userId).subscribe({
      next: (drives) => {
        if (drives.length === 0) {
          this.drivesWithBookings = [];
          this.loading = false;
          if (event) event.target.complete();
          return;
        }

        const requests = drives.map(drive => 
          this.bookingService.getPendingBookingsByDrive(drive.id)
        );

        forkJoin(requests).subscribe({
          next: (bookingsArrays) => {
            this.drivesWithBookings = drives
              .map((drive, index) => ({
                drive,
                pendingBookings: bookingsArrays[index].filter(b => b.role === BookingRole.CLIENT)
              }))
              .filter(item => item.pendingBookings.length > 0);
            
            this.loading = false;
            if (event) event.target.complete();
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
            this.loading = false;
            if (event) event.target.complete();
          }
        });
      },
      error: (error) => {
        console.error('Error loading drives:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  acceptBooking(booking: BookingResponse) {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookingService.acceptBooking(booking.driveId, booking.userId).subscribe({
      next: () => {
        this.loadDriverRequests();
      },
      error: (error) => {
        console.error('Error accepting booking:', error);
        alert('Failed to accept booking. Please try again.');
      }
    });
  }

  declineBooking(booking: BookingResponse) {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (confirm('Are you sure you want to decline this booking request?')) {
      this.bookingService.declineBooking(booking.driveId, booking.userId).subscribe({
        next: () => {
          this.loadDriverRequests();
        },
        error: (error) => {
          console.error('Error declining booking:', error);
          alert('Failed to decline booking. Please try again.');
        }
      });
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

  viewDriveDetails(driveId: number) {
    this.router.navigate(['/ride-details', driveId], {
      queryParams: { driverMode: 'true' }
    });
  }

  private looksLikeStreetNumber(text: string): boolean {
    return /^[\d\-\/]+$/.test(text.trim());
  }

  handleRefresh(event: any) {
    this.loadDriverRequests(event);
  }

  goBack() {
    this.location.back();
  }

  onMenuOpen() {
    this.isPanelOpen = true;
  }

  onPanelClosed() {
    this.isPanelOpen = false;
  }

  onNotificationOpen() {
    this.router.navigate(['/notifications']);
  }

  onMenuItemClick(item: string) {
    this.redirectService.redirect('driver-requests', item);
  }

  onRideClick(rideId: number) {
    this.router.navigate(['/ride-details', rideId], {
      queryParams: { driverMode: 'true' }
    });
  }
}
