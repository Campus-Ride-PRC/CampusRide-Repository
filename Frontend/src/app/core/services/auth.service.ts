import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { last, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../models/userRequest.model';
import { Faculty } from '../models/faculty.model';
import { UserVerification } from '../models/userVerification.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;

  private registrationData: UserRequest = {} as UserRequest;

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

  verifyUser(payload: UserVerification): Observable<UserRequest> {
    return this.http.post<UserRequest>(`${this.apiUrl}/register/verify`, payload);
  };


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
}