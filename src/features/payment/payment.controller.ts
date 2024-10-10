import { Controller, Post, Body, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
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
        processPaymentDto.method,
        
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('receive-payment')
  async receivePayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const result = await this.paymentsService.confirmPayment(confirmPaymentDto);
      return {
        message: 'Pago recibido correctamente',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('confirm-funds')
async confirmFundsReceived(@Body('paymentReference') paymentReference: string) {
  try {
    const result = await this.paymentsService.confirmFundsReceived(paymentReference);
    return {
      message: 'Fondos recibidos confirmados',
      result,
    };
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Post('disburse-funds')
async disburseFunds(@Body('reference') reference: string) {
  return this.paymentsService.disburseFunds(reference);
}



  
}
