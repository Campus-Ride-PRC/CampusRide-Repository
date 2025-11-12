import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root'
})
export class HomeService{
  private loggedUser: UserResponse = {} as UserResponse;
  constructor(private http: HttpClient) {}

  setLoggedUser(user: UserResponse) {
    console.log("Setting logged user in HomeService:", user);
    this.loggedUser = user;
  }

  getLoggedUser(): UserResponse {
    return this.loggedUser;
}



}
