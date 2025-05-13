const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error al enviar el email');
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Bienvenido a La Barberia LM';
    const html = `
      <h1>¡Bienvenido a La Barberia LM, ${user.name}!</h1>
      <p>Gracias por registrarte en nuestra plataforma.</p>
      <p>Esperamos que disfrutes de nuestros servicios.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Recuperación de Contraseña';
    const html = `
      <h1>Recuperación de Contraseña</h1>
      <p>Hola ${user.name},</p>
      <p>Has solicitado restablecer tu contraseña. Usa el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }
}

module.exports = new EmailService(); 