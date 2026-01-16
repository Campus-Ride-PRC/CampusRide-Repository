import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod, PaymentMethodCreateRequest } from '../models/payment-method.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodService {
    private apiUrl = `${environment.apiUrl}/payment-methods`;

    constructor(private http: HttpClient) { }

    getMyPaymentMethods(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(this.apiUrl);
    }

    addPaymentMethod(request: PaymentMethodCreateRequest): Observable<PaymentMethod> {
        return this.http.post<PaymentMethod>(this.apiUrl, request);
    }

    setDefaultPaymentMethod(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/default`, {});
    }

    deletePaymentMethod(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
