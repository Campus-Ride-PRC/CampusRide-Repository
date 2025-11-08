import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';

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

  constructor(private router: Router) {}

  onContinue() {
    // TODO: Implement password validation and navigation to next register step
    console.log('Continue with password registration clicked: ', this.password);

    this.router.navigate(['/register/phone']);
  }
}