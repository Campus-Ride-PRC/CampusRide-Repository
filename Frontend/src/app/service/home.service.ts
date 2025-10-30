import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const localhost = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

constructor(private http: HttpClient) { }

sayHi(): string{
    return "Hi from HomeService";
}

}
