package com.example.OlysProyect.EmailSenderService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(List<String> recipients, String subject, String messageBody) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("olysbowl@gmail.com");
        helper.setTo(recipients.toArray(new String[0])); // Convertir la lista a array
        helper.setSubject(subject);
        helper.setText(messageBody, true); // `true` para permitir HTML

        mailSender.send(mimeMessage);
    }
}
