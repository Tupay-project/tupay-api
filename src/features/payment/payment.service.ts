import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Customer } from '../customer/entities/customer.entity';
import { PaymentProvider } from '../provider/entities/provider.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Invoice)  // Repositorio para las facturas
    private readonly invoiceRepository: Repository<Invoice>
  ) {}

  async processPayment(reference: string, ...otrosDatos): Promise<any> {
    // Procesar el pago
    const pagoExitoso = true; // Simular el resultado del pago

    // realizar el codigo para llamar a la api del proveedor 
  
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

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<any> {
    const { reference, status } = confirmPaymentDto;

    // Buscar el pago por la referencia
    const payment = await this.paymentsRepository.findOne({ where: { paymentReference: reference } });

    if (!payment) {
      throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
    }

    // Actualizar el estado del pago según la confirmación
    payment.status = status === 'success' ? 'completed' : 'failed';

    // Guardar el pago actualizado en la base de datos
    await this.paymentsRepository.save(payment);

    return payment;
  }

  async confirmFundsReceived(paymentReference: string): Promise<any> {
    const payment = await this.paymentsRepository.findOne({ where: { paymentReference } });
  
    if (!payment) {
      throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Actualizar el estado a 'funds_received'
    payment.status = 'funds_received';
    await this.paymentsRepository.save(payment);
  
    return payment;
  }

  async disburseFunds(reference: string): Promise<any> {
    // Buscar la factura por referencia
    const invoice = await this.invoiceRepository.findOne({ where: { paymentReference: reference } });
    
    if (!invoice) {
      throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
    }
  
    // Verificar que los fondos hayan sido recibidos antes del payout
    if (invoice.status !== 'funds_received') {
      throw new HttpException('Los fondos aún no han sido confirmados', HttpStatus.BAD_REQUEST);
    }
  
    // Simular el payout (transferencia al proveedor)
    invoice.status = 'disbursed';  // O 'completed', según cómo manejes tu sistema
    await this.invoiceRepository.save(invoice);
  
    return {
      message: 'Fondos transferidos al proveedor con éxito',
      invoice,
    };
  }
  
  
  
}
