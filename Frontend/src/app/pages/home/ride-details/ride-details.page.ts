import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DriveService } from 'src/app/core/services/drive.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriveDetails } from 'src/app/core/models/drive-details.model';
import { BookingRequest } from 'src/app/core/models/booking.model';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './ride-details.page.html',
  styleUrls: ['./ride-details.page.scss'],
})
export class RideDetailsPage implements OnInit {
  driveId!: number;
  drive: DriveDetails | null = null;
  loading = false;
  error: string | null = null;
  requestingRide = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driveService: DriveService,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.driveId = parseInt(id, 10);
      this.loadDriveDetails();
    } else {
      this.error = 'Invalid drive ID';
    }
  }

  loadDriveDetails() {
    this.loading = true;
    this.error = null;
    
    this.driveService.getDriveById(this.driveId).subscribe({
      next: (response) => {
        this.drive = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading drive details:', error);
        this.error = 'Failed to load drive details';
        this.loading = false;
      }
    });
  }

  getDriverName(): string {
    if (!this.drive) return '';
    return `${this.drive.driverFirstName} ${this.drive.driverLastName}`;
  }

  getFromLocation(): string {
    if (!this.drive) return '';
    return this.drive.fromNeighborhood || this.drive.fromLocationName;
  }

  getToLocation(): string {
    if (!this.drive) return '';
    return this.drive.toNeighborhood || this.drive.toLocationName;
  }

  formatDepartureTime(): string {
    if (!this.drive) return '';
    
    const date = new Date(this.drive.time);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${timeStr}`;
    } else {
      return `${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })}, ${timeStr}`;
    }
  }

  formatPrice(): string {
    if (!this.drive) return '';
    return `${this.drive.price} RON`;
  }

  async onRequestRide() {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      await this.showToast('You must be logged in to request a ride', 'warning');
      this.router.navigate(['/login/auth']);
      return;
    }

    // Confirm the request
    const alert = await this.alertController.create({
      header: 'Confirm Request',
      message: 'Are you sure you want to request this ride?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.submitRideRequest(userId);
          }
        }
      ]
    });

    await alert.present();
  }

  private submitRideRequest(userId: number) {
    if (!this.drive) return;

    this.requestingRide = true;
    const request: BookingRequest = {
      driveId: this.driveId,
      userId: userId
    };

    this.bookingService.requestRide(request).subscribe({
      next: async (response) => {
        this.requestingRide = false;
        await this.showToast('Ride request sent successfully! Status: ' + response.status, 'success');
        // Optionally navigate back or refresh the page
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: async (error) => {
        this.requestingRide = false;
        console.error('Error requesting ride:', error);
        
        let errorMessage = 'Failed to request ride. Please try again.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please check your information.';
        } else if (error.status === 404) {
          errorMessage = 'Drive or user not found.';
        }
        
        await this.showToast(errorMessage, 'danger');
      }
    });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
