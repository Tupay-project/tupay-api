import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  

// MAILER_EMAIL=flowermoreno7@gmail.com
// MAILER_SECRET_KEY=xuagyvzcjbpqplwf
  constructor() {
    // Configura el transportador con las credenciales del servicio de correo (por ejemplo, Gmail, SMTP, etc.)
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // O el servicio SMTP que estés usando
      auth: {
        user: 'flowermoreno7@gmail.com',
        pass: 'xuagyvzcjbpqplwf',
      },
    });
  }

  // Método para enviar correos
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'flowermoreno7@gmail.com', // Remitente autorizado
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  }
}
