import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { envs } from 'src/shared/config';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
constructor(

){
  sgMail.setApiKey(envs.SENDGRID_API_KEY)
}
async sendEmail (sendEmailDto:SendEmailDto):Promise<void>{

  try {
    const msg ={
     to:sendEmailDto.to,
     from:sendEmailDto.from,
     subject:sendEmailDto.subject,
     html:sendEmailDto.html

    }
    await sgMail.send(msg); 

    console.log('Correo enviado con éxito.');

  
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new HttpException('Error al enviar el correo electrónico', HttpStatus.INTERNAL_SERVER_ERROR);
    
  }

}
}
