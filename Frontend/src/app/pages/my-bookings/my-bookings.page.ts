import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  IonIcon, IonBadge, IonSpinner, IonText, IonButtons, IonMenuButton
} from '@ionic/angular/standalone';
import { BookingService } from 'src/app/core/services/booking.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingResponse, BookingStatus, BookingRole } from 'src/app/core/models/booking.model';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  carOutline, locationOutline, timeOutline, cashOutline, 
  closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
  mailOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
    IonIcon, IonBadge, IonSpinner, IonButtons, IonMenuButton,
    CommonModule, FormsModule
  ]
})
export class MyBookingsPage implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  BookingStatus = BookingStatus;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    addIcons({ 
      carOutline, locationOutline, timeOutline, cashOutline,
      closeCircleOutline, checkmarkCircleOutline, hourglassOutline,
      mailOutline
    });
  }

  ngOnInit() {
    this.loadBookings();
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
        // Filter to show only bookings where user is CLIENT (passenger)
        this.bookings = bookings
          .filter(booking => booking.role === BookingRole.CLIENT)
          .sort((a, b) => {
            // Sort by status priority: PENDING > ACCEPTED > others
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

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.ACCEPTED: return 'success';
      case BookingStatus.DECLINED: return 'danger';
      case BookingStatus.CANCELED: return 'medium';
      default: return 'medium';
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
}
