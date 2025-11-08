import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { OtpInputComponent } from 'src/app/shared/components/text-input/otp-input.component';

@Component({
  selector: 'app-register-code-validation',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, OtpInputComponent],
  templateUrl: './code-validation.page.html',
  styleUrls: ['./code-validation.page.scss'],
})
export class CodeValidationPage {

  constructor(private router: Router) {}

  code: string = '';

  onContinue() {
    this.router.navigate(['/register/result']);
  }
}
