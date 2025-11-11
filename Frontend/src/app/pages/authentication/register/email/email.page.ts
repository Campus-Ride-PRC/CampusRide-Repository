import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { AuthService } from 'src/app/core/services/auth.service'; // verifică calea reală

@Component({
  selector: 'app-register-email',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent],
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage {
  email: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@stud\.ubbcluj\.ro$/;
    return emailRegex.test(email);
  }


  onContinue() {
    if (!this.email) {
      this.showToast('Please enter an email address.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.showToast('Invalid email format. You need to use a stud.ubbcluj.ro email.');
      return;
    }

    this.authService.checkEmail(this.email).subscribe({
      next: () => {
        // user exists → show error
        this.showToast('An account with this email already exists.');
      },
      error: (err) => {
        if (err.status === 404) {
          // user not found → continue registration
          this.authService.setEmail(this.email);
          this.router.navigate(['/register/password']);
        } else {
          this.showToast('An unexpected error occurred.');
        }
      },
    });
  }
}
