/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Param, HttpException, HttpStatus, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post('pay/:invoiceId')
  // @ApiOperation({ summary: 'Procesar un pago para una factura pendiente' })
  // @ApiParam({ name: 'invoiceId', description: 'ID de la factura a pagar' })
  // @ApiResponse({ status: 200, description: 'Pago procesado con éxito' })
  // @ApiResponse({ status: 400, description: 'El monto del pago no coincide con el monto de la factura' })
  // @ApiResponse({ status: 500, description: 'Error interno en el servidor' })
  // async processPayment(
  //   @Param('invoiceId') invoiceId: string, 
  //   @Body() paymentData: ProcessPaymentDto
  // ): Promise<any> {
  //   try {
  //     console.log('Iniciando procesamiento del pago para la factura:', invoiceId);
  //     const invoice = await this.paymentService.processPayment(invoiceId, paymentData);
  //     console.log('Pago procesado con éxito para la factura ID:', invoiceId);
  //     return {
  //       message: 'Pago procesado con éxito',
  //       invoice,
  //     };
  //   } catch (error) {
  //     console.error('Error procesando el pago:', error.message);
  //     throw new HttpException(error.message || 'Error al procesar el pago', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Post('create-payment-session')
  createtePaymentSession(){
    return  'create-payment-session'
    // return this.paymentService.createPaymentSession()
  }


  @Post('pay/:invoiceId')
  @ApiOperation({ summary: 'Procesar un pago para una factura pendiente' })
  @ApiParam({ name: 'invoiceId', description: 'ID de la factura a pagar' })
  processPayment(@Param('invoiceId') invoiceId: string, @Body() paymentData: any) {
    return `Pago procesado para la factura ${invoiceId}`;
  }

  @Post('confirm/:paymentId')
  @ApiOperation({ summary: 'Confirmar un pago' })
  @ApiParam({ name: 'paymentId', description: 'ID del pago a confirmar' })
  confirmPayment(@Param('paymentId') paymentId: string) {
    return `Pago confirmado para el ID ${paymentId}`;
  }

  @Post('notify-provider')
  @ApiOperation({ summary: 'Notificar al proveedor sobre el pago' })
  notifyProvider(@Body() notificationData: any) {
    return 'Proveedor notificado del pago';
  }

  @Post('create-transaction')
  @ApiOperation({ summary: 'Crear una transacción asociada al pago' })
  createTransaction(@Body() transactionData: any) {
    return 'Transacción creada';
  }

  @Get('user/:userId/transactions')
  @ApiOperation({ summary: 'Obtener las transacciones del usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  getTransactionsForUser(@Param('userId') userId: string) {
    return `Transacciones del usuario ${userId}`;
  }

  @Get('provider/:providerId/transactions')
  @ApiOperation({ summary: 'Obtener las transacciones del proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  getTransactionsForProvider(@Param('providerId') providerId: string) {
    return `Transacciones del proveedor ${providerId}`;
  }
}
