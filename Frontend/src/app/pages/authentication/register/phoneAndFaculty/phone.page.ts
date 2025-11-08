import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from 'src/app/shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register-phone',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent],
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage {
  phoneNumber: string = '';
  faculty: string = '';

  onContinue() {
    // TODO: Implement phone number validation and navigation to next register step
    console.log('Continue with phone number registration clicked: ', this.phoneNumber);
    console.log('Continue with faculty registration clicked: ', this.faculty);
  }
}