import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primary-button.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  onLogin() {
    // Handle login navigation
    console.log('Login clicked');
  }
}
