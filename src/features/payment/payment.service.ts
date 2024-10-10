import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Customer } from '../customer/entities/customer.entity';
import { PaymentProvider } from '../provider/entities/provider.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(PaymentProvider)
    private readonly providerRepository: Repository<PaymentProvider>,
    @InjectRepository(Invoice)  // Repositorio para las facturas
    private readonly invoiceRepository: Repository<Invoice>
  ) {}

  async processPayment(reference: string, ...otrosDatos): Promise<any> {
    // Procesar el pago
    const pagoExitoso = true; // Simular el resultado del pago
  
    if (pagoExitoso) {
      // Cambiar el estado de la invoice a "completed"
      const invoice = await this.invoiceRepository.findOne({ where: { paymentReference: reference } });
      if (!invoice) {
        throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
      }
  
      invoice.status = 'completed';
      await this.invoiceRepository.save(invoice);
    } else {
      // Cambiar el estado de la invoice a "failed"
      const invoice = await this.invoiceRepository.findOne({ where: { paymentReference: reference } });
      if (!invoice) {
        throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
      }
  
      invoice.status = 'failed';
      await this.invoiceRepository.save(invoice);
    }
  
    return {
      message: 'Pago procesado con éxito',
    };
  }
  

  async handlePaymentWebhook(payload: any): Promise<any> {
    const paymentReference = payload.reference;
    const status = payload.status;

    const payment = await this.paymentsRepository.findOne({ where: { paymentReference } });
    if (payment) {
      payment.status = status === 'success' ? 'completed' : 'failed';
      await this.paymentsRepository.save(payment);
    }

    return { status: 'Webhook recibido y pago actualizado correctamente' };
  }
}
