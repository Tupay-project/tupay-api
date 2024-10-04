import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CashInService } from '../services/cash-in.service';

@Controller('cashin')
export class CashInController {
  constructor(private readonly cashInService: CashInService) {}

  // Endpoint para generar una nueva transacción para una factura
  @Post('generate-transaction')
  generateTransaction(@Body('facturaId') facturaId: number, @Body('clientId') clientId: number) {
    return this.cashInService.generateTransaction(facturaId, clientId);
  }

  // Endpoint para seleccionar el método de pago para la transacción
  @Post('select-payment-method')
  selectPaymentMethod(@Body('transactionId') transactionId: number, @Body('paymentMethod') paymentMethod: string) {
    return this.cashInService.selectPaymentMethod(transactionId, paymentMethod);
  }

  // Endpoint para ingresar los datos básicos del cliente para la transacción
  @Post('enter-basic-data')
  enterBasicData(@Body('transactionId') transactionId: number, @Body('customerData') customerData: any) {
    return this.cashInService.enterBasicData(transactionId, customerData);
  }

  // Endpoint para completar la transacción
  @Post('complete-transaction')
  completeTransaction(@Body('transactionId') transactionId: number) {
    return this.cashInService.completeTransaction(transactionId);
  }

  // Endpoint para descargar el comprobante de pago
  @Get('download-receipt/:transactionId')
  downloadReceipt(@Param('transactionId') transactionId: number) {
    return this.cashInService.downloadReceipt(transactionId);
  }

  // Endpoint para finalizar la transacción
  @Post('finalize-transaction')
  finalizeTransaction(@Body('transactionId') transactionId: number) {
    return this.cashInService.finalizeTransaction(transactionId);
  }
}
