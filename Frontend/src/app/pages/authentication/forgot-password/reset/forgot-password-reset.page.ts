import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ResetPasswordService } from 'src/app/core/services/reset.password.service';

@Component({
  selector: 'app-forgot-password-reset',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent],
  templateUrl: './forgot-password-reset.page.html',
  styleUrls: ['./forgot-password-reset.page.scss'],
})
export class ForgotPasswordResetPage implements OnInit {
  email: string = '';
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  // Validare parolă
  passwordErrors: string[] = [];
  showPasswordStrength: boolean = false;

  constructor(
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private toastController: ToastController
  ) {
    // Preluăm email-ul și codul din state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
      this.code = navigation.extras.state['code'];
    }
  }

  ngOnInit() {
    // Dacă nu avem email sau cod, redirectăm înapoi
    if (!this.email || !this.code) {
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

  // Verifică forța parolei în timp real
  onPasswordInput() {
    if (this.newPassword.length > 0) {
      this.showPasswordStrength = true;
      const validation = this.resetPasswordService.validatePasswordStrength(this.newPassword);
      this.passwordErrors = validation.errors;
    } else {
      this.showPasswordStrength = false;
      this.passwordErrors = [];
    }
  }

  validatePasswords(): boolean {
    // Verifică dacă câmpurile sunt goale
    if (!this.newPassword || !this.confirmPassword) {
      this.showToast('Te rog completează ambele câmpuri de parolă.');
      return false;
    }

    // Verifică forța parolei
    const validation = this.resetPasswordService.validatePasswordStrength(this.newPassword);
    if (!validation.valid) {
      this.showToast('Parola nu îndeplinește cerințele de securitate.');
      return false;
    }

    // Verifică dacă parolele sunt identice
    if (!this.resetPasswordService.validatePasswordsMatch(this.newPassword, this.confirmPassword)) {
      this.showToast('Parolele nu sunt identice. Te rog verifică și încearcă din nou.');
      return false;
    }

    return true;
  }

  onContinue() {
    if (!this.validatePasswords()) {
      return;
    }

    this.isLoading = true;

    this.resetPasswordService.resetPassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        console.log('Password reset successful:', response);
        this.isLoading = false;
        this.showToast('Parola a fost resetată cu succes!', 'success');
        
        // Navighează la pagina de login după 2 secunde
        setTimeout(() => {
          this.router.navigate(['/login/auth']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        
        if (err.status === 400) {
          this.showToast('Cod invalid sau expirat. Te rog încearcă din nou.');
        } else {
          this.showToast('A apărut o eroare. Te rog încearcă din nou.');
        }
      }
    });
  }

  // Helper pentru afișarea validării în template
  get passwordStrengthColor(): string {
    const errorsCount = this.passwordErrors.length;
    if (errorsCount === 0) return 'text-green-500';
    if (errorsCount <= 2) return 'text-yellow-500';
    return 'text-red-500';
  }

  get passwordsMatch(): boolean | null {
    if (!this.confirmPassword) return null;
    return this.resetPasswordService.validatePasswordsMatch(this.newPassword, this.confirmPassword);
  }
}
