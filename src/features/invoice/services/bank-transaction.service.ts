import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { BankTransaction } from '../entities/bank-transaction.entity';

@Injectable()
export class BankTransactionService {
  constructor(
    @InjectRepository(BankTransaction)
    private readonly transactionRepository: Repository<BankTransaction>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
  ) {}

  // Método para actualizar el estado de la transacción desde el webhook
  async updateTransactionStatus(invoiceId: string, providerId: string, status: string): Promise<BankTransaction> {
    const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
    const provider = await this.providerRepository.findOne({ where: { id: providerId } });

    if (!invoice || !provider) {
      throw new Error('Invoice or Provider not found');
    }

    const transaction = this.transactionRepository.create({
      invoice,
      provider,
      status,
      transactionDate: new Date(),
    });

    // Actualizar el estado de la factura si la transacción fue exitosa
    if (status === 'success') {
      invoice.status = 'paid';
      await this.invoiceRepository.save(invoice);
    }

    return this.transactionRepository.save(transaction);
  }
}
