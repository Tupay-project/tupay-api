import { Controller, Post, Body, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
// import { JwtGuard } from '../auth/guards/auth.guard';


// @UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('process')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      // Aquí NO necesitas el providerId del token JWT, solo los datos del cliente
      const result = await this.paymentsService.processPayment(
        processPaymentDto.reference,
        processPaymentDto.amount,
        processPaymentDto.currency,
        processPaymentDto.numdoc,
        processPaymentDto.username,
        processPaymentDto.userphone,
        processPaymentDto.useremail,
        processPaymentDto.typetransaction,
        processPaymentDto.method
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
