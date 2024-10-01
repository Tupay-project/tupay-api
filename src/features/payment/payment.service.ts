import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { WebhookService } from '../manager/services/webhook.service';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { Payment } from '../manager/entities/payment.entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { envs } from 'src/shared/config';
import { Loan } from '../loan/entities/loan.entity';
import { Transaction } from '../manager/entities/transaction.entity';
import axios from 'axios';


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

    private readonly connection: Connection,  // Inyecta la conexión de TypeORM


  ) {}

  // async processPayment(invoiceId: string, paymentData: ProcessPaymentDto): Promise<any> {
  //   const invoice = await this.invoiceService.findInvoiceById(invoiceId);

  //   if (!invoice) {
  //     throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
  //   }

  //   if (invoice.status === 'paid') {
  //     throw new HttpException('The invoice has already been paid', HttpStatus.BAD_REQUEST);
  //   }

  //   if (invoice.amount !== paymentData.amount) {
  //     throw new HttpException('Payment amount does not match invoice amount', HttpStatus.BAD_REQUEST);
  //   }

  //   // Actualiza el estado de la factura
  //   invoice.status = 'paid';
  //   await this.invoiceService.updateInvoice(invoice);

  //   // Crea la transacción asociada
  //   await this.transactionService.createTransaction({
  //     invoiceId: invoice.id,
  //     amount: paymentData.amount,
  //     status: 'success',
  //     paymentMethod: paymentData.method,
  //     paymentReference: paymentData.paymentReference,
  //     providerId: paymentData.providerId,
  //     reference: paymentData.reference,
  //   });

  //   // Envía la notificación webhook al proveedor
  //   try {
  //     await this.webhookService.notifyProvider({
  //       id: invoice.id,
  //       amount: invoice.amount,
  //       status: invoice.status,
  //       paymentReference: invoice.paymentReference,
  //       customer: invoice.customer,
  //     });
  //   } catch (error) {
  //     console.error('Error enviando el webhook:', error);
  //   }

  //   return invoice;
  // }

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

  // async processPayment(invoiceId: string, paymentData: ProcessPaymentDto): Promise<any> {
  //   const queryRunner = this.connection.createQueryRunner();
  //   await queryRunner.startTransaction();

  //   try {
  //     const invoice = await this.invoiceService.findInvoiceById(invoiceId);
  //     if (!invoice) {
  //       throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
  //     }

  //     if (invoice.status === 'paid') {
  //       throw new HttpException('The invoice has already been paid', HttpStatus.BAD_REQUEST);
  //     }

  //     if (invoice.amount !== paymentData.amount) {
  //       throw new HttpException('Payment amount does not match invoice amount', HttpStatus.BAD_REQUEST);
  //     }

  //     // Actualiza el estado de la factura a "paid"
  //     invoice.status = 'paid';
  //     await this.invoiceService.updateInvoice(invoice);

  //     // Crea la transacción asociada
  //     await this.transactionService.createTransaction({
  //       invoiceId: invoice.id,
  //       amount: paymentData.amount,
  //       status: 'success',
  //       paymentMethod: paymentData.method,
  //       paymentReference: paymentData.paymentReference,
  //       providerId: paymentData.providerId,
  //       reference: paymentData.reference,
  //       type: 'credit' // Proporcionamos el valor del tipo de transacción aquí
  //     });

  //     // Envía la notificación webhook al proveedor
  //     try {
  //       await this.webhookService.notifyProvider({
  //         id: invoice.id,
  //         amount: invoice.amount,
  //         status: invoice.status,
  //         paymentReference: invoice.paymentReference,
  //         customer: invoice.customer,
  //       });
  //     } catch (error) {
  //       console.error('Error enviando el webhook:', error);
  //     }

  //     await queryRunner.commitTransaction(); // Confirma la transacción

  //     return invoice;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction(); // Revierte la transacción en caso de error
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   } finally {
  //     await queryRunner.release(); // Libera el query runner al final
  //   }
  // }
  async processPayment(invoiceId: string, paymentData: ProcessPaymentDto): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
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

      // Actualiza el estado de la factura a "paid"
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
        type: 'credit',  // Tipo de transacción
      });

      // Envía la notificación webhook al proveedor
      try {
        const webhookUrl = invoice.customer.provider.webhookUrl; // Asume que el proveedor tiene un webhook URL registrado
        if (webhookUrl) {
          await axios.post(webhookUrl, {
            id: invoice.id,
            amount: invoice.amount,
            status: invoice.status,
            paymentReference: invoice.paymentReference,
            customer: invoice.customer,
          });
        }
      } catch (error) {
        console.error('Error enviando el webhook:', error);
      }

      await queryRunner.commitTransaction();
      return invoice;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  
}
