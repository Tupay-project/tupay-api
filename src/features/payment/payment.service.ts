/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { validate as isUUID } from 'uuid';  // Importar función para validar UUID
import { Invoice } from '../invoice/entities/invoice.entity';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly transactionService: TransactionService,
  ) {}

  async processPayment(invoiceId: string, paymentData: ProcessPaymentDto): Promise<Invoice> {
    // Verificamos si el invoiceId es un UUID válido
    if (!isUUID(invoiceId)) {
      throw new HttpException('El ID de la factura no es un UUID válido', HttpStatus.BAD_REQUEST);
    }

    // Buscar la factura en la base de datos
    const invoice = await this.invoiceService.findInvoiceById(invoiceId);

    // Si no se encuentra la factura, lanzamos una excepción
    if (!invoice) {
      throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificamos si la factura ya ha sido pagada
    if (invoice.status === 'paid') {
      throw new HttpException('La factura ya ha sido pagada', HttpStatus.BAD_REQUEST);
    }
    console.log('Tipo de invoice.amount:', typeof invoice.amount); // Debe mostrar 'number'
    console.log('Tipo de paymentData.amount:', typeof paymentData.amount); // Debe mostrar 'number'
    
    // Comparamos el monto del pago con el monto de la factura
    if (invoice.amount !== paymentData.amount) {
      console.error('El monto del pago no coincide con el monto de la factura');
      throw new HttpException('El monto del pago no coincide con el monto de la factura', HttpStatus.BAD_REQUEST);
    }
    
    

    // Actualizamos el estado de la factura a 'paid'
    invoice.status = 'paid';
    await this.invoiceService.updateInvoice(invoice);

    // Creamos la transacción relacionada con el pago
    const transaction = await this.transactionService.createTransaction({
      invoiceId: invoice.id,
      amount: paymentData.amount,
      status: 'success',
      paymentMethod: paymentData.method,
      paymentReference: paymentData.paymentReference,
      providerId: paymentData.providerId,
      reference: paymentData.reference,  // Referencia única de la transacción
    });

    // Aquí puedes disparar un webhook o notificación si es necesario
    // await this.webhookService.notify(paymentData);

    return invoice;  // Retornamos la factura actualizada
  }
}
