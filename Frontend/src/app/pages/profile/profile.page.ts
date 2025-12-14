import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel, IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {UserResponse} from "../../core/models/userResponse";
import {Profile} from "../../core/services/profile";
import {DriveCard} from "../../core/models/drive-card.model";
import {RideCardComponent} from "../../shared/components/cards/ride-card.component";
import {Router} from "@angular/router";
import {BookingResponse} from "../../core/models/booking.model";
import {BookingCardComponent} from "../../shared/components/booking-card/booking-card.component";
import {AppHeaderComponent} from "../../shared/components/header/app-header.component";
import {SidePanelComponent} from "../../shared/components/panel/side-panel.component";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RideCardComponent, BookingCardComponent, AppHeaderComponent, SidePanelComponent]
})
export class ProfilePage implements OnInit {
  isPanelOpen = false;

  constructor(private location: Location, private service: Profile, private router: Router, private authService: AuthService) {
  }

  protected user!: UserResponse
  protected user_state :string = "loading"
  protected drives_state: string = "loading";
  protected booking__state: string = "loading";

  protected myDrives! : DriveCard[];
  protected myBookings!: BookingResponse[];

  ngOnInit() {
    this.service.getLoggedUser().subscribe({
      next: data => {
        this.user = data;
        console.log(data);
        this.user_state = "ready"

      },
      error: err => {
        console.log(err);
      }
    })
    this.service.getDrives().subscribe({
      next: data => {
        if (data . length > 3 ){
          this.myDrives = data.slice(0, 3);
          this.drives_state = "ready"
        }
        else {
          this.myDrives = data;
          this.drives_state = "ready"
        }
      },
      error: err => {
        console.log(err);
      }
    })
    this.service.getBookings().subscribe({
      next: data => {
        if (data . length > 3 ){
          this.myBookings = data.slice(0, 3);
          this.booking__state = "ready"
        }
        else {
          this.myBookings = data;
          this.booking__state = "ready"
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  goBack() {
    this.location.back();
  }

  getDriverName(drive: DriveCard): string {
    return `${drive.driverFirstName} ${drive.driverLastName}`;
  }

  getFromLocation(drive: DriveCard): string {
    // Prefer neighborhood for a short, descriptive name
    return drive.fromAddress.neighborhood || this.getShortLocationName(drive.fromAddress);
  }

  getToLocation(drive: DriveCard): string {
    const addr = drive.toAddress;
    
    // Prefer neighborhood as the most descriptive short name
    if (addr.neighborhood) {
      return addr.neighborhood;
    }
    
    // If locationName looks like a place name (not just a number or street number), use it
    const locationName = addr.locationName;
    if (locationName && !this.looksLikeStreetNumber(locationName) && !locationName.includes(',')) {
      return locationName;
    }
    
    // Fall back to street name
    return addr.street || 'Unknown';
  }

  private looksLikeStreetNumber(text: string): boolean {
    // Check if text looks like just a street number (e.g., "58-60", "23-25", "62")
    return /^[\d\-\/]+$/.test(text.trim());
  }

  private getShortLocationName(address: any): string {
    // Extract a short name from locationName (take first part before comma)
    if (address.locationName && !this.looksLikeStreetNumber(address.locationName)) {
      const parts = address.locationName.split(',');
      return parts[0].trim();
    }
    return address.street || 'Unknown';
  }

  formatDepartureTime(time: string): string {
    const date = new Date(time);
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
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
    }
  }

  formatPrice(price: number): string {
    return `${price} RON`;
  }

  onCardClick(drive: DriveCard) {
    this.router.navigate(['/ride-details', drive.id]);
  }

  onBookingClick(booking: BookingResponse): void {
    this.router.navigate(['/ride-details', booking.driveId], {
      queryParams: { returnTo: 'profile' }
    });
  }

  goToAllDrives() : void {
    this.router.navigate(['/home']);
  }

  goToAllBookings(): void {
    this.router.navigate(['/my-bookings']);
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
    console.log('Menu item clicked:', item);

    switch(item) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'drives':
        this.router.navigate(['/add-drive']);
        break;
      case 'my-bookings':
        this.router.navigate(['/my-bookings']);
        break;
      case 'my-rides':
        this.router.navigate(['/my-rides']);
        break;
      case 'driver-requests':
        this.router.navigate(['/driver-requests']);
        break;
      case 'settings':
        console.log('Settings feature coming soon');
        break;
      case 'profile':
        // Already on profile
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
