import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { WebhookService } from '../manager/services/webhook.service';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { Payment } from '../manager/entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { envs } from 'src/shared/config';
import { Loan } from '../loan/entities/loan.entity';
import { Transaction } from '../manager/entities/transaction.entity';


@Injectable()
export class PaymentService {

  private readonly stripe =new Stripe(envs.STRIPE_SECRET_KEY)
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly transactionService: TransactionService,
    private readonly webhookService: WebhookService, 
    @InjectRepository(Payment) 
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Loan) 
    private readonly loanRepository: Repository<Loan>,

    
    @InjectRepository(Transaction) 
    private readonly transactionRepository: Repository<Transaction>,



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

  async createPaymentSession(processPaymentDto: ProcessPaymentDto): Promise<Stripe.Checkout.Session> {
    // Crear la sesión de pago en Stripe
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Especificar métodos de pago
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pago de Préstamo', // Descripción del pago
            },
            unit_amount: processPaymentDto.amount * 100, // Convertir el monto a centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Modo de pago
      success_url: 'http://localhost:5000/api/v1/payments/success', // URL de éxito
      cancel_url: 'http://localhost:5000/api/v1/payments/cancelled', // URL de cancelación
      payment_intent_data: {
        metadata: {
          method: processPaymentDto.method,  // Método de pago
          paymentReference: processPaymentDto.paymentReference,  // Referencia de pago
          providerId: processPaymentDto.providerId,  // ID del proveedor
          reference: processPaymentDto.reference,  // Referencia de la transacción
          userId: processPaymentDto.userId,  // ID del usuario
        },
      },
    });

    // Retornar la sesión de pago creada
    return session;
  }

  async createLoanPaymentSession(loanId: string, paymentData: ProcessPaymentDto): Promise<any> {
    const loan = await this.loanRepository.findOne({ where: { id: loanId }, relations: ['provider'] });
    if (!loan) {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
  
    if (loan.status === 'paid') {
      throw new HttpException('This loan is already paid', HttpStatus.BAD_REQUEST);
    }
  
    // Crear la sesión de pago con Stripe
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          loanId: loan.id,
          providerId: loan.provider.id, // Guardamos el ID del proveedor
          userId: paymentData.userId,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Loan Payment for Loan #${loan.id}`,
            },
            unit_amount: loan.outstandingBalance * 100, // Convertimos a centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5000/api/v1/webhooks/success',
      cancel_url: 'http://localhost:5000/api/v1/webhooks/cancelled',
    });
  
    // Registrar la transacción
    const transaction = this.transactionRepository.create({
      loan,
      provider: loan.provider, // Registramos el proveedor
      amount: paymentData.amount,
      status: 'pending',
      paymentReference: session.id,
    });
  
    await this.transactionRepository.save(transaction);
  
    return {
      message: 'Transacción creada exitosamente. Completa el pago en el siguiente enlace.',
      paymentLink: session.url,
    };
  }
  


  
}
