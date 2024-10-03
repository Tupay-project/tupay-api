import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}


  @Post('test-email')
  async sendTestEmail(@Body('to') sendEmailDto:SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto);
    return { message: 'Correo enviado con éxito' };
  }


}
