import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../manager/entities/transaction.entity';

@Injectable()
export class WebhookServiceTransfeProviders {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async handleTransactionStatus(webhookPayload: any): Promise<void> {
    const { paymentReference, status, failureReason } = webhookPayload;

    console.log('Webhook payload recibido:', webhookPayload); // Log para verificar el webhook recibido

    // Encuentra la transacción usando la referencia de pago
    const transaction = await this.transactionRepository.findOne({ where: { paymentReference } });

    if (!transaction) {
      throw new HttpException('Transacción no encontrada', HttpStatus.NOT_FOUND);
    }

    // Actualizar el estado de la transacción basado en el webhook
    if (status === 'success') {
      transaction.status = 'success';
    } else if (status === 'failed') {
      transaction.status = 'failed';
      transaction.failureReason = failureReason || 'Motivo no especificado';
    }

    // Guardar los cambios en la base de datos
    await this.transactionRepository.save(transaction);
    console.log('Estado de la transacción actualizado:', transaction.status);
  }
}
