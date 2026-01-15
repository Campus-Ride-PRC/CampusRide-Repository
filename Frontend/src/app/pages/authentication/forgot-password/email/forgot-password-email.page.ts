import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ResetPasswordService } from 'src/app/core/services/reset.password.service';

@Component({
  selector: 'app-forgot-password-email',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent],
  templateUrl: './forgot-password-email.page.html',
  styleUrls: ['./forgot-password-email.page.scss'],
})
export class ForgotPasswordEmailPage {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private toastController: ToastController
  ) {}

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onContinue() {
    if (!this.email) {
      this.showToast('Te rog introdu adresa de email.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.showToast('Format email invalid.');
      return;
    }

    this.isLoading = true;

    this.resetPasswordService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        console.log('Reset code sent:', response);
        this.isLoading = false;
        this.showToast('Codul de verificare a fost trimis pe email!', 'success');
        
        // Navighează la pagina de introducere cod
        this.router.navigate(['/forgot-password/code'], {
          state: { email: this.email }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        
        if (err.status === 404) {
          this.showToast('Email-ul nu există în sistem.');
        } else {
          this.showToast('A apărut o eroare. Te rog încearcă din nou.');
        }
      }
    });
  }
}
