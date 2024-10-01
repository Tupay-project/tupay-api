import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Webhook } from '../entities/webhook.entity';
// import { SinglePayment } from '../entities/single-payment.entity';
import { Server } from 'socket.io';
import { validate as isUuid } from 'uuid';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(
    // @InjectRepository(Webhook)
    // private webhookRepository: Repository<Webhook>,
    // @InjectRepository(SinglePayment)
    // private paymentRepository: Repository<SinglePayment>,
  ) {}
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  // async processWebhook(payload: any): Promise<void> {
  //   const { event_type, payment } = payload;
  //   const paymentId = payment.id;

  //   if (!isUuid(paymentId)) {
  //     throw new BadRequestException('Invalid UUID format for payment ID');
  //   }

  //   const paymentToUpdate = await this.paymentRepository.findOne({
  //     where: { id: paymentId },
  //   });
  //   if (!paymentToUpdate) {
  //     throw new BadRequestException(`Payment with ID ${paymentId} not found`);
  //   }

  //   let newStatus = 'PENDING';
  //   if (event_type === 'payment.succeeded') {
  //     newStatus = 'SUCCEEDED';
  //     this.server.emit('paymentUpdate', { paymentId, status: 'SUCCEEDED' });
  //   } else if (event_type === 'payment.failed') {
  //     newStatus = 'FAILED';
  //     this.server.emit('paymentUpdate', { paymentId, status: 'FAILED' });
  //   } else {
  //     throw new BadRequestException(`Unsupported event type: ${event_type}`);
  //   }

  //   paymentToUpdate.status = newStatus;
  //   await this.paymentRepository.save(paymentToUpdate);

  //   const webhookRecord = this.webhookRepository.create({
  //     eventType: event_type,
  //     payload: JSON.stringify(payload), // Guardar el payload como un string JSON
  //     processedAt: new Date(),
  //     status: paymentToUpdate.status, // Puedes asignar el estado como 'SUCCEEDED' o 'FAILED' basado en el evento
  //     payment: paymentToUpdate, // Asociar el pago con el registro de webhook
  //   });

  //   await this.webhookRepository.save(webhookRecord);

  //   console.log(
  //     `Payment ID: ${paymentId} updated to status: ${paymentToUpdate.status}`,
  //   );
  // }

  async processWebhook(payload: any): Promise<void> {
    const { event_type, payment } = payload;
    const { id: paymentId, invoiceId } = payment;
  
    if (!isUuid(paymentId)) {
      throw new Error('Invalid UUID format for payment ID');
    }
  
    // const paymentToUpdate = await this.paymentRepository.findOne({ where: { id: paymentId } });
    // if (!paymentToUpdate) {
    //   throw new Error(`Payment with ID ${paymentId} not found`);
    // }
  
    const newStatus = event_type === 'payment.succeeded' ? 'SUCCEEDED' : 'FAILED';
    // paymentToUpdate.status = newStatus;
  
    // Registrar el webhook
    // const webhookRecord = this.webhookRepository.create({
    //   eventType: event_type,
    //   payload: JSON.stringify(payload),
    //   processedAt: new Date(),
    //   status: newStatus,
    //   payment: paymentToUpdate,
    // });
  
    // await this.webhookRepository.save(webhookRecord);
    // await this.paymentRepository.save(paymentToUpdate);
  
    // Emitir evento de socket
    this.server.emit('paymentUpdate', { paymentId, status: newStatus, invoiceId });
  
    // console.log(`Payment ID: ${paymentId} updated to status: ${paymentToUpdate.status}`);
  }


  async notifyProvider(data: {
    id: string;
    amount: number;
    status: string;
    paymentReference: string;
    customer: any;
  }): Promise<void> {
    const webhookUrl = data.customer.provider.webhookUrl;

    if (!webhookUrl) {
      throw new HttpException('No webhook URL found for provider', HttpStatus.BAD_REQUEST);
    }

    try {
      // Llamada al webhook del proveedor con los datos de la transacción
      await axios.post(webhookUrl, {
        transactionId: data.id,
        amount: data.amount,
        status: data.status,
        paymentReference: data.paymentReference,
        customer: {
          id: data.customer.id,
          name: data.customer.name,
          email: data.customer.email,
        },
      });
    } catch (error) {
      console.error(`Error enviando notificación al webhook: ${error.message}`);
      throw new HttpException('Error enviando notificación al proveedor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
