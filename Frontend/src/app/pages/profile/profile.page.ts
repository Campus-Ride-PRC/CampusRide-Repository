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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonItem, IonLabel, IonList, RideCardComponent, BookingCardComponent]
})
export class ProfilePage implements OnInit {

  constructor(private location: Location, private service: Profile,private router: Router) {
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
    return drive.fromAddress.locationName || drive.fromAddress.neighborhood || drive.fromAddress.city;
  }

  getToLocation(drive: DriveCard): string {
    return drive.toAddress.locationName || drive.toAddress.neighborhood || drive.toAddress.city;
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
  goToAllDrives() : void {
    this.router.navigate(['/home']);
  }

  goToAllBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

}
