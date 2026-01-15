import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { PaymentMethodService } from 'src/app/core/services/payment-method.service';
import { PaymentMethod, PaymentMethodCreateRequest, PaymentMethodType } from 'src/app/core/models/payment-method.model';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Location, ViewportScroller } from '@angular/common';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    addCircleOutline,
    trashOutline,
    starOutline,
    star,
    cardOutline,
    cashOutline,
    calendarOutline,
    personOutline,
    keypadOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-payment-methods',
    templateUrl: './payment-methods.page.html',
    styleUrls: ['./payment-methods.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class PaymentMethodsPage implements OnInit {
    private paymentMethodService = inject(PaymentMethodService);
    private toastController = inject(ToastController);
    private alertController = inject(AlertController);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    paymentMethods = signal<PaymentMethod[]>([]);
    isLoading = signal<boolean>(false);
    isAdding = signal<boolean>(false);

    // Return URL for navigation back
    private returnUrl: string | null = null;

    // New Card Form Data
    cardNumber = '';
    holderName = '';
    cvc = '';
    expiryYear = '';
    expiryMonth = '';
    cardType = 'unknown';

    newCardLastFour = ''; // Computed when saving

    constructor() {
        addIcons({
            arrowBackOutline,
            addCircleOutline,
            trashOutline,
            starOutline,
            star,
            cardOutline,
            cashOutline,
            calendarOutline,
            personOutline,
            keypadOutline
        });
    }

    ngOnInit() {
        // Get return URL from query params
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.loadPaymentMethods();
    }

    // Navigate back - either to return URL or default
    goBack() {
        if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
        } else {
            this.location.back();
        }
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

    toggleAddForm() {
        this.isAdding.update(v => !v);
        this.resetForm();
    }

    resetForm() {
        this.cardNumber = '';
        this.holderName = '';
        this.cvc = '';
        this.expiryYear = '';
        this.expiryMonth = '';
        this.cardType = 'unknown';
        this.newCardLastFour = '';
    }

    onCardInput(event: any) {
        const raw = event?.target?.value || '';
        this.cardType = this.detectCardBrand(raw);
        // Basic formatting could go here if needed
        this.cardNumber = raw;
    }

    detectCardBrand(raw: string): string {
        const digits = (raw || '').replace(/\D/g, '');
        if (!digits) return 'unknown';

        if (digits.startsWith('4')) return 'visa';

        const first2 = parseInt(digits.slice(0, 2), 10);
        const first4 = parseInt(digits.slice(0, 4), 10);

        if (!Number.isNaN(first2) && first2 >= 51 && first2 <= 55) return 'mastercard';
        if (!Number.isNaN(first4) && first4 >= 2221 && first4 <= 2720) return 'mastercard';

        return 'unknown';
    }

    addPaymentMethod() {
        // Basic validation
        const digitsOnly = this.cardNumber.replace(/\D/g, '');
        if (digitsOnly.length < 13) {
            this.showToast('Please enter a valid card number', 'warning');
            return;
        }

        if (!this.holderName.trim()) {
            this.showToast('Please enter the card holder name', 'warning');
            return;
        }

        this.newCardLastFour = digitsOnly.slice(-4);
        const providerName = this.cardType === 'visa' ? 'Visa' : (this.cardType === 'mastercard' ? 'Mastercard' : 'Other');

        const request: PaymentMethodCreateRequest = {
            provider: providerName,
            methodType: PaymentMethodType.CARD,
            providerPaymentId: 'mock_pm_' + Math.random().toString(36).substr(2, 9), // Mock ID
            lastFour: this.newCardLastFour,
            setAsDefault: this.paymentMethods().length === 0 // Auto default if first
        };

        this.paymentMethodService.addPaymentMethod(request).subscribe({
            next: (newMethod) => {
                this.showToast('Payment method added successfully', 'success');
                this.loadPaymentMethods();
                this.toggleAddForm();
            },
            error: (error) => {
                console.error('Error adding payment method', error);
                this.showToast('Failed to add payment method', 'danger');
            }
        });
    }

    async confirmDelete(id: number) {
        const alert = await this.alertController.create({
            header: 'Delete Payment Method',
            message: 'Are you sure you want to remove this payment method?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.deleteMethod(id);
                    }
                }
            ]
        });
        await alert.present();
    }

    deleteMethod(id: number) {
        this.paymentMethodService.deletePaymentMethod(id).subscribe({
            next: () => {
                this.showToast('Payment method removed', 'success');
                this.loadPaymentMethods();
            },
            error: (error) => {
                console.error('Error deleting payment method', error);
                this.showToast('Failed to delete payment method', 'danger');
            }
        });
    }

    setDefaultPaymentMethod(id: number) {
        this.paymentMethodService.setDefaultPaymentMethod(id).subscribe({
            next: () => {
                this.showToast('Default payment method updated', 'success');
                this.loadPaymentMethods();
            },
            error: (error) => {
                console.error('Error setting default method', error);
                this.showToast('Failed to set default method', 'danger');
            }
        });
    }

    async showToast(message: string, color: 'success' | 'danger' | 'warning') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }
}
