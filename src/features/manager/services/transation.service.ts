import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/CreateTransactionDto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
  ) {}

  // Crear transacción
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { invoiceId, paymentReference, amount, providerId, status, failureReason } = createTransactionDto;

    // Buscar la factura asociada
    const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
    if (!invoice) {
      throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificar si el monto coincide
    if (invoice.amount !== amount) {
      throw new HttpException('El monto del pago no coincide con el monto de la factura', HttpStatus.BAD_REQUEST);
    }

    // Buscar el proveedor
    const provider = await this.providerRepository.findOne({ where: { id: providerId } });
    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    // Crear y guardar la transacción
    const transaction = this.transactionRepository.create({
      invoice,
      paymentReference,
      amount,
      provider,
      status,
      failureReason,
    });

    return this.transactionRepository.save(transaction);
  }

  // Obtener todas las transacciones
  async findAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['invoice', 'provider'] });
  }

  // Obtener transacción por ID
  async findTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id }, relations: ['invoice', 'provider'] });
    if (!transaction) {
      throw new HttpException('Transacción no encontrada', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }
}
