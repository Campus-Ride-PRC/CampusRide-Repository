package campus.ride.interfaces;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String code, String firstName, String lastName);
    void sendVerificationEmailResetPassword(String toEmail, String code, String firstName, String lastName);
}
