import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, last, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../models/userRequest.model';
import { Faculty } from '../models/faculty.model';
import { UserVerification } from '../models/userVerification.model';
import { UserResponse } from '../models/userResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private registrationData: UserRequest = {} as UserRequest;
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/exists`, { email });
  }

  registerUser(): Observable<string> {
    const payload = {
      email: this.registrationData.email,
      password: this.registrationData.password,
      phoneNumber: this.registrationData.phoneNumber,
      lastName: this.registrationData.lastName,
      firstName: this.registrationData.firstName,
      faculty: this.registrationData.faculty,
    };

    return this.http.post(`${this.apiUrl}/register/create`, payload, { responseType: 'text' });
  }

  verifyUser(payload: UserVerification): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register/verify`, payload).pipe(
      tap(user => {
        if (user.token) {
          this.saveToken(user.token);
        }
        this.saveUser(user);
      })
    );
  };

  login(email: string, password: string): Observable<UserResponse> {
    const payload = { email, password };
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(user => {
        if (user.token) {
          this.saveToken(user.token);
        }
        this.saveUser(user);
      })
    );
  }


  getRegistrationData(): UserRequest {
    return this.registrationData;
  }

  setFirstName(firstName: string) {
    this.registrationData.firstName = firstName;
  }

  setLastName(lastName: string) {
    this.registrationData.lastName = lastName;
  }

  setEmail(email: string) {
    this.registrationData.email = email;
  }

  setPassword(password: string) {
    this.registrationData.password = password;
  }

  setPhoneNumber(phoneNumber: string) {
    this.registrationData.phoneNumber = phoneNumber;
  }

  setFaculty(faculty: Faculty) {
    this.registrationData.faculty = faculty;
  }

  // JWT Token Management
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.currentUserSubject.value !== null;
  }

  // User Management
  saveUser(user: UserResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): UserResponse | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }
}