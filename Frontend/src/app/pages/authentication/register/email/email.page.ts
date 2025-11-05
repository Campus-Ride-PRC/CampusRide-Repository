import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register-email',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PrimaryButtonComponent, FormsModule, TextInputComponent],
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage {
  email: string = '';

  onContinue() {
    // TODO: Implement email validation and navigation to next register step
    console.log('Continue with email registration clicked: ', this.email);
  }
}
