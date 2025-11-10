import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register-name',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PrimaryButtonComponent, FormsModule, TextInputComponent],
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage {
  firstName: string = '';
  lastName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
) {}

  onContinue() {
    this.authService.setFirstName(this.firstName);
    this.authService.setLastName(this.lastName);
    
    this.router.navigate(['/register/email']);
  }
}