import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Customer } from '../customer/entities/customer.entity';
import { PaymentProvider } from '../provider/entities/provider.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(PaymentProvider)
    private readonly providerRepository: Repository<PaymentProvider>
  ) {}

  async processPayment(
    reference: string,
    amount: string,
    currency: string,
    numdoc: string,
    username: string,
    userphone: string,
    useremail: string,
    typetransaction: string,
    method: string,
    providerId: string // Mantendremos el providerId
  ): Promise<any> {
    // Buscar el proveedor por su ID
    const provider = await this.providerRepository.findOne({ where: { id: providerId } });
    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    // Crear un nuevo cliente utilizando los datos proporcionados en el link de pago
    const newCustomer = this.customerRepository.create({
      name: username,
      email: useremail,
      phoneNumber: userphone,
      governmentId: numdoc,
    });

    // Guardar el nuevo cliente en la base de datos
    const savedCustomer = await this.customerRepository.save(newCustomer);

    // Crear un nuevo pago asociado con el cliente recién creado y el proveedor existente
    const payment = this.paymentsRepository.create({
      amount: parseFloat(amount),
      currency,
      status: 'pending',  // Estado inicial: pendiente
      method,
      paymentReference: reference,
      customer: savedCustomer,  // Relacionar el pago con el cliente recién creado
      provider,  // Relacionar el pago con el proveedor
    });

    // Guardar el pago en la base de datos
    const savedPayment = await this.paymentsRepository.save(payment);

    return {
      message: 'Pago procesado con éxito',
      savedPayment,
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
