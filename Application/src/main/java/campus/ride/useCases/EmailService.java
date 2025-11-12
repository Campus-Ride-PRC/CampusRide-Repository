package campus.ride.useCases;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

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
    public void sendVerificationEmail(String toEmail, String code, String firstName, String lastName) {
        logger.info("Starting to send HTML verification email to {}", toEmail);
        try {
            String htmlBody = loadHtmlTemplate();

            String fullName = firstName + " " + lastName;
            htmlBody = htmlBody.replace("{{USER_NAME}}", fullName);
            htmlBody = htmlBody.replace("{{VERIFICATION_CODE}}", code);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CampusRide - Verification code");

            helper.setText(htmlBody, true);

            mailSender.send(message);
            logger.info("HTML Verification email sent to {} with code {}", toEmail, code);

        } catch (MessagingException | IOException e) {
            logger.error("Failed to send HTML email to " + toEmail, e);
        }
    }

    private String loadHtmlTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("verificationEmail.html");

        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
             BufferedReader bufferedReader = new BufferedReader(reader)) {

            return bufferedReader.lines().collect(Collectors.joining("\n"));
        }
    }
}
