import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register-password',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PrimaryButtonComponent, FormsModule, TextInputComponent],
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {
  password: string = '';
  passwordConfirm: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  onContinue() {
    if (this.password !== this.passwordConfirm) {
      this.toastController.create({
        message: 'Passwords do not match.',
        duration: 2000,
        color: 'danger'
      }).then(toast => toast.present());
      return;
    }

    if(this.password.length < 8) {
      this.toastController.create({
        message: 'Password must be at least 8 characters.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      }).then(toast => toast.present());
      return;
    }

    this.authService.setPassword(this.password);
    this.router.navigate(['/register/phone']);
  }
}