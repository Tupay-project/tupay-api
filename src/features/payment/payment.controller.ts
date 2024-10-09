import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async processPayment(
    @Query('reference') reference: string,
    @Query('amount') amount: string,
    @Query('currency') currency: string,
    @Query('numdoc') numdoc: string,
    @Query('username') username: string,
    @Query('userphone') userphone: string,
    @Query('useremail') useremail: string,
    @Query('typetransaction') typetransaction: string,
    @Query('method') method: string,
    @Query('providerId') providerId: string,  // ID del proveedor
  ) {
    try {
      return await this.paymentsService.processPayment(
        reference,
        amount,
        currency,
        numdoc,
        username,
        userphone,
        useremail,
        typetransaction,
        method,
        providerId,
      );
    } catch (error) {
      console.error('Error procesando el pago:', error);
      throw new HttpException('Error al procesar el pago', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
