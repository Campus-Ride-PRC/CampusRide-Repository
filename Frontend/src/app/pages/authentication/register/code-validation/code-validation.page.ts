import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { OtpInputComponent } from 'src/app/shared/components/text-input/otp-input.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserVerification } from 'src/app/core/models/userVerification.model';

@Component({
  selector: 'app-register-code-validation',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, OtpInputComponent],
  templateUrl: './code-validation.page.html',
  styleUrls: ['./code-validation.page.scss'],
})
export class CodeValidationPage {

  constructor(private router: Router, 
    private authService: AuthService, 
    private toastController: ToastController
  ) {}

  code: string = '';

  codeValidation(){
    if (!this.code || this.code.length !== 6) {
      this.toastController.create({
        message: 'Please enter a valid 6-digit code.',
        duration: 2000,
        color: 'danger'
      }).then(toast => toast.present());
      return;
    }
  }

  onContinue() {
    this.codeValidation();

    const payload: UserVerification = {
      email: this.authService.getRegistrationData().email,
      verificationCode: this.code
    };

    this.authService.verifyUser(payload).subscribe({
      next: (user) => {
        console.log('User verified:', user);
        this.router.navigate(['/register/result']);
      },
      error: (err) => {
        this.toastController.create({
          message: 'Verification failed. Please check your code.',
          duration: 2000,
          color: 'danger'
        }).then(toast => toast.present());
        console.error(err);
      }
    });
  }
}