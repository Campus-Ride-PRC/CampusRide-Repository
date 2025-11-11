import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { AuthService } from 'src/app/core/services/auth.service'; 

@Component({
  selector: 'app-login-auth',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  email: string = '';
  password: string = '';

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

  onContinue() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
