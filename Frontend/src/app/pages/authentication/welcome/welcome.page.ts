import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primary-button.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent, RouterModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  constructor(
    private router: Router
  ) {}

  onLogin() {
    this.router.navigate(['/home']);
  }
}
