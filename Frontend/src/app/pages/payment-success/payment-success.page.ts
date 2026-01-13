import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/core/services/payment.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, homeOutline } from 'ionicons/icons';

@Component({
    selector: 'app-payment-success',
    templateUrl: './payment-success.page.html',
    styleUrls: ['./payment-success.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class PaymentSuccessPage implements OnInit {
    private paymentService = inject(PaymentService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // State
    isLoading = signal<boolean>(true);
    isSuccess = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    driveId = signal<number | null>(null);

    constructor() {
        addIcons({
            checkmarkCircleOutline,
            closeCircleOutline,
            homeOutline
        });
    }

    ngOnInit() {
        // Get session_id and drive_id from URL params
        const sessionId = this.route.snapshot.queryParamMap.get('session_id');
        const driveIdParam = this.route.snapshot.queryParamMap.get('drive_id');

        if (driveIdParam) {
            this.driveId.set(parseInt(driveIdParam, 10));
        }

        if (!sessionId) {
            this.isLoading.set(false);
            this.isSuccess.set(false);
            this.errorMessage.set('Invalid payment session');
            return;
        }

        // Verify payment with backend
        this.verifyPayment(sessionId);
    }

    private verifyPayment(sessionId: string) {
        this.paymentService.verifyPayment(sessionId).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                this.isSuccess.set(true);
            },
            error: (error) => {
                console.error('Payment verification failed:', error);
                this.isLoading.set(false);
                this.isSuccess.set(false);
                this.errorMessage.set(error.error?.message || 'Payment verification failed');
            }
        });
    }

    goToHome() {
        this.router.navigate(['/home']);
    }

    goToMyBookings() {
        this.router.navigate(['/my-bookings']);
    }

    goToRideDetails() {
        const id = this.driveId();
        if (id) {
            this.router.navigate(['/ride-details', id]);
        } else {
            this.router.navigate(['/home']);
        }
    }
}
