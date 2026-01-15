import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { OtpInputComponent } from 'src/app/shared/components/text-input/otp-input.component';
import { ResetPasswordService } from 'src/app/core/services/reset.password.service';

@Component({
  selector: 'app-forgot-password-code',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, OtpInputComponent],
  templateUrl: './forgot-password-code.page.html',
  styleUrls: ['./forgot-password-code.page.scss'],
})
export class ForgotPasswordCodePage implements OnInit {
  email: string = '';
  code: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private toastController: ToastController
  ) {
    // Preluăm email-ul din state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
    }
  }

  ngOnInit() {
    // Dacă nu avem email, redirectăm înapoi
    if (!this.email) {
      this.router.navigate(['/forgot-password/email']);
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }

  codeValidation() {
    if (!this.code || this.code.length !== 6) {
      this.showToast('Te rog introdu un cod valid de 6 cifre.');
      return false;
    }
    return true;
  }

  onContinue() {
    if (!this.codeValidation()) {
      return;
    }

    this.isLoading = true;

    this.resetPasswordService.verifyResetCode(this.email, this.code).subscribe({
      next: (isValid) => {
        console.log('Code verification result:', isValid);
        this.isLoading = false;
        
        if (isValid) {
          this.showToast('Cod valid! Acum poți reseta parola.', 'success');
          
          // Navighează la pagina de reset parolă
          this.router.navigate(['/forgot-password/reset'], {
            state: { 
              email: this.email,
              code: this.code
            }
          });
        } else {
          this.showToast('Cod invalid. Te rog verifică și încearcă din nou.');
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showToast('Cod invalid sau expirat. Te rog încearcă din nou.');
      }
    });
  }

  resendCode() {
    this.resetPasswordService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        console.log('Code resent:', response);
        this.showToast('Un nou cod a fost trimis pe email!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showToast('Eroare la retrimiterea codului.');
      }
    });
  }
}
