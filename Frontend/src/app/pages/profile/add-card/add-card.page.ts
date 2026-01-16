import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgSwitchCase} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput, IonItemOption,
  IonLabel, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {AppHeaderComponent} from "../../../shared/components/header/app-header.component";
import {Router} from "@angular/router";
import {calendarOutline, cardOutline, keypadOutline, personOutline} from 'ionicons/icons';
import {SidePanelComponent} from "../../../shared/components/panel/side-panel.component";
import {UserResponse} from "../../../core/models/userResponse";
import {AuthService} from "../../../core/services/auth.service";
import {Profile} from "../../../core/services/profile";

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, AppHeaderComponent, IonInput, IonLabel, IonButton, IonIcon, CommonModule, NgSwitchCase, IonSelect, IonItemOption, IonSelectOption, SidePanelComponent]
})
export class AddCardPage implements OnInit  {
  isPanelOpen = false;
  protected user!: UserResponse
  constructor() { }
  private router = inject(Router);
  public cardType: string = "unknown";
  private authService = inject(AuthService);
  private service = inject(Profile);
  protected user_state :string = "loading"

  cardOutline = cardOutline;

  onMenuOpen() {
    this.isPanelOpen = true;
  }
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
  }
  onNotificationOpen() {
    this.router.navigate(['/notifications']);
  }

  protected readonly personOutline = personOutline;
  protected readonly keypadOutline = keypadOutline;
  protected readonly calendarOutline = calendarOutline;

 detectCardBrand(raw: string):string {

    const digits = (raw || '').replace(/\D/g, '');

    if (!digits) return 'unknown';

    if (digits.startsWith('4')) return 'visa';

    const first2 = parseInt(digits.slice(0, 2), 10);
    const first4 = parseInt(digits.slice(0, 4), 10);

    if (!Number.isNaN(first2) && first2 >= 51 && first2 <= 55) return 'mastercard';
    if (!Number.isNaN(first4) && first4 >= 2221 && first4 <= 2720) return 'mastercard';

    return 'unknown';
  }

  onCardInput(event: any):void {
   const raw = event?.target?.value || 'unknown';
   this.cardType = this.detectCardBrand(raw);
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
  onPanelClosed() {
    this.isPanelOpen = false;
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
