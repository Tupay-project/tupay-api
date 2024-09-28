import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { WebhookService } from '../manager/services/webhook.service';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { Payment } from '../manager/entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PaymentService {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly transactionService: TransactionService,
    private readonly webhookService: WebhookService, 
    @InjectRepository(Payment) // Inyecta el repositorio de Payment

    private readonly paymentRepository: Repository<Payment>,

  ) {}

  async processPayment(invoiceId: string, paymentData: ProcessPaymentDto): Promise<any> {
    const invoice = await this.invoiceService.findInvoiceById(invoiceId);

    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }

    if (invoice.status === 'paid') {
      throw new HttpException('The invoice has already been paid', HttpStatus.BAD_REQUEST);
    }

    if (invoice.amount !== paymentData.amount) {
      throw new HttpException('Payment amount does not match invoice amount', HttpStatus.BAD_REQUEST);
    }

    // Actualiza el estado de la factura
    invoice.status = 'paid';
    await this.invoiceService.updateInvoice(invoice);

    // Crea la transacción asociada
    await this.transactionService.createTransaction({
      invoiceId: invoice.id,
      amount: paymentData.amount,
      status: 'success',
      paymentMethod: paymentData.method,
      paymentReference: paymentData.paymentReference,
      providerId: paymentData.providerId,
      reference: paymentData.reference,
    });

    // Envía la notificación webhook al proveedor
    try {
      await this.webhookService.notifyProvider({
        id: invoice.id,
        amount: invoice.amount,
        status: invoice.status,
        paymentReference: invoice.paymentReference,
        customer: invoice.customer,
      });
    } catch (error) {
      console.error('Error enviando el webhook:', error);
    }

    return invoice;
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  // Método para obtener un pago por ID
  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
    }

    return payment;
  }
}
