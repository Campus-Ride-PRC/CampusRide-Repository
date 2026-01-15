import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset/password/verify-email`, 
      { email }, 
      { responseType: 'text' }
    );
  }

  verifyResetCode(email: string, code: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/reset/password/verify-code`, {
      email,
      code
    });
  }

  /**
   * Pasul 3: Resetează parola cu noul password
   * @param email - Adresa de email
   * @param newPassword - Parola nouă
   * @returns Observable cu răspunsul de la server
   */
  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset/password/confirm`, 
      { 
        email,
        newPassword 
      }, 
      { responseType: 'text' }
    );
  }

  validatePasswordsMatch(password1: string, password2: string): boolean {
    return password1 === password2 && password1.length > 0;
  }

  validatePasswordStrength(password: string): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
