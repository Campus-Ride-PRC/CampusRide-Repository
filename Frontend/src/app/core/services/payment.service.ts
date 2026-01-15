import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CheckoutSessionRequest {
    driveId: number;
    pickupAddressId: number | null;
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutSessionResponse {
    sessionId: string;
    checkoutUrl: string;
}

export interface VerifyPaymentResponse {
    status: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    /**
     * Get Stripe public key from backend
     */
    getStripePublicKey(): Observable<{ publicKey: string }> {
        return this.http.get<{ publicKey: string }>(`${this.apiUrl}/stripe-key`);
    }

    /**
     * Create a Stripe Checkout Session
     */
    createCheckoutSession(request: CheckoutSessionRequest): Observable<CheckoutSessionResponse> {
        return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/create-checkout-session`, request);
    }

    /**
     * Verify a completed payment and create the booking
     */
    verifyPayment(sessionId: string): Observable<VerifyPaymentResponse> {
        return this.http.post<VerifyPaymentResponse>(`${this.apiUrl}/verify-payment?sessionId=${sessionId}`, {});
    }

    /**
     * Redirect to Stripe Checkout
     */
    redirectToCheckout(checkoutUrl: string): void {
        window.location.href = checkoutUrl;
    }
}
