package campus.ride.useCases;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService implements campus.ride.interfaces.EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private static final Logger logger = LogManager.getLogger(EmailService.class);

   @Override
    public void sendVerificationEmail(String toEmail, String code) {
        logger.info("Starting to send verification email to {}", toEmail);
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("CampusRide - Codul tău de verificare");
        message.setText("Bun venit la CampusRide! \n\n" +
                        "Codul tău de verificare este: " + code +
                        "\n\nAcest cod expiră în 10 minute.");
        mailSender.send(message);

        logger.info("Verification email sent to {}", toEmail);
    }
}
