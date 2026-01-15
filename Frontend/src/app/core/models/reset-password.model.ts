export interface ResetPasswordRequest {
    email: string;
}

export interface VerifyResetCode {
    email: string;
    code: string;
}

export interface ResetPassword {
    email: string;
    newPassword: string;
}

export interface ResetPasswordFormData {
    email: string;
    newPassword: string;
    confirmPassword: string;
}