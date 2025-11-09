import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primary-button.component';
import { RideCardComponent } from '../../../shared/components/cards/ride-card.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent, RideCardComponent],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  onLogin() {
    // Handle login navigation
    console.log('Login clicked');
  }

  onRideCardClick() {
    console.log('Ride card clicked');
  }
}
