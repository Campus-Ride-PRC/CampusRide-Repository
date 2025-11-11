import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primary-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent, RouterModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  onLogin() {
    console.log('Login clicked');
  }

  onRideCardClick() {
    console.log('Ride card clicked');
  }
}
