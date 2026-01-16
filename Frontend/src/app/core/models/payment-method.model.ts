export enum PaymentMethodType {
    CARD = 'CARD',
    CASH = 'CASH'
}

export interface PaymentMethod {
    id: number;
    userId: number;
    provider: string; // e.g., 'Stripe'
    methodType: PaymentMethodType;
    lastFour?: string;
    isDefault: boolean;
    createdAt: string;
}

export interface PaymentMethodCreateRequest {
    provider: string;
    methodType: PaymentMethodType;
    providerPaymentId?: string; // Stripe PaymentMethod ID
    lastFour?: string;
    setAsDefault: boolean;
}
