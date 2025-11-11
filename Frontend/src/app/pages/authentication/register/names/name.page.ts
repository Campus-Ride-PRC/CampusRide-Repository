import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register-name',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PrimaryButtonComponent, FormsModule, TextInputComponent],
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage {
  firstName: string = '';
  lastName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
) {}

  onContinue() {
    if (!this.firstName || !this.lastName) {
      this.toastController.create({
        message: 'Please enter both first and last names.',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
      return;
    }

    if(this.firstName.length < 3 || this.lastName.length < 3) {
      this.toastController.create({
        message: 'First and last names must be at least 3 characters.',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
      return;
    }

    this.authService.setFirstName(this.firstName);
    this.authService.setLastName(this.lastName);
    
    this.router.navigate(['/register/email']);
  }
}