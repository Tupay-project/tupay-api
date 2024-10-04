import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { CashInService } from '../services/cash-in.service';
import { PrinterService } from 'src/shared/modules/printer/printer.service';
import { Response } from 'express';

@Controller('cashin')
export class CashInController {
  constructor(
    private readonly cashInService: CashInService,
    private readonly printerService: PrinterService
  ) {}

  // Endpoint para generar una nueva transacción para una factura
  @Post('generate-transaction')
  generateTransaction(@Body('facturaId') facturaId: number, @Body('clientId') clientId: number) {
    return this.cashInService.generateTransaction(facturaId, clientId);
  }

  @Post('generate-invoice')
  async generateInvoice(
    @Body('clientData') clientData: any,
    @Body('invoiceDetails') invoiceDetails: any[],
    @Body('totalAmount') totalAmount: number,
    @Body('invoiceNumber') invoiceNumber: string,
    @Body('issueDate') issueDate: string,
    @Body('convenioNumber') convenioNumber: string, 
    @Res() res: Response
  ) {
    try {
      const pdfDoc = this.printerService.createInvoicePdf(
        clientData,
        invoiceDetails,
        totalAmount,
        invoiceNumber,
        issueDate,
        convenioNumber
      );
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
  
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      console.error('Error al generar la factura:', error); // Agregar logs para verificar el problema
      res.status(500).send('Error interno del servidor');
    }
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
