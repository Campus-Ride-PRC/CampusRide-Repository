import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentMethodService } from 'src/app/core/services/payment-method.service';
import { PaymentMethod, PaymentMethodType } from 'src/app/core/models/payment-method.model';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    cardOutline,
    cashOutline,
    checkmarkCircle
} from 'ionicons/icons';

@Component({
    selector: 'app-payment-selection',
    templateUrl: './payment-selection.page.html',
    styleUrls: ['./payment-selection.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class PaymentSelectionPage implements OnInit {
    private paymentMethodService = inject(PaymentMethodService);
    private toastController = inject(ToastController);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    // Signals for reactive state
    paymentMethods = signal<PaymentMethod[]>([]);
    isLoading = signal<boolean>(true);
    selectedPaymentId = signal<number | 'CASH' | null>(null);

    // Return URL for navigation
    private returnUrl: string | null = null;

    // Accepted payment types (can be passed via query params or set defaults)
    acceptedTypes = signal<string[]>(['CASH', 'CARD']);

    constructor() {
        addIcons({
            arrowBackOutline,
            cardOutline,
            cashOutline,
            checkmarkCircle
        });
    }

    ngOnInit() {
        // Get return URL and accepted types from query params
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const typesParam = this.route.snapshot.queryParamMap.get('acceptedTypes');
        if (typesParam) {
            this.acceptedTypes.set(typesParam.split(','));
        }
        
        this.loadPaymentMethods();
    }

    goBack() {
        this.location.back();
    }

    loadPaymentMethods() {
        this.isLoading.set(true);
        this.paymentMethodService.getMyPaymentMethods().subscribe({
            next: (methods) => {
                this.paymentMethods.set(methods);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading payment methods', error);
                this.showToast('Failed to load payment methods', 'danger');
                this.isLoading.set(false);
            }
        });
    }

    selectPaymentMethod(id: number | 'CASH') {
        this.selectedPaymentId.set(id);
    }

    isSelected(id: number | 'CASH'): boolean {
        return this.selectedPaymentId() === id;
    }

    isPaymentTypeAccepted(type: 'CARD' | 'CASH'): boolean {
        return this.acceptedTypes().includes(type);
    }

    hasCardPaymentMethods(): boolean {
        return this.paymentMethods().length > 0;
    }

    canContinue(): boolean {
        return this.selectedPaymentId() !== null;
    }

    onContinue() {
        if (!this.canContinue()) {
            this.showToast('Please select a payment method', 'warning');
            return;
        }

        const selectedId = this.selectedPaymentId();
        
        // Navigate back with the selected payment method
        if (this.returnUrl) {
            const separator = this.returnUrl.includes('?') ? '&' : '?';
            const paymentParam = selectedId === 'CASH' ? 'paymentType=CASH' : `paymentMethodId=${selectedId}`;
            this.router.navigateByUrl(`${this.returnUrl}${separator}${paymentParam}`);
        } else {
            // If no return URL, just go back
            this.location.back();
        }
    }

    private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = await this.toastController.create({
            message,
            duration: 2500,
            color,
            position: 'bottom'
        });
        await toast.present();
    }
}
