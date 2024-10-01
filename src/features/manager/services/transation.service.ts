import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/CreateTransactionDto';
import { InvoiceService } from 'src/features/invoice/invoice.service';
import { FundingProviderService } from 'src/features/funding-provider/funding-provider.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly invoiceService: InvoiceService, // Servicio de facturas
    private readonly fundingProviderService: FundingProviderService, // Servicio de proveedores de fondos

    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
  ) {}

  // Crear transacción
  // async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
  //   const { invoiceId, paymentReference, amount, providerId, status, failureReason } = createTransactionDto;

  //   // Buscar la factura asociada
  //   const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
  //   if (!invoice) {
  //     throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
  //   }

  //   // Verificar si el monto coincide
  //   if (invoice.amount !== amount) {
  //     throw new HttpException('El monto del pago no coincide con el monto de la factura', HttpStatus.BAD_REQUEST);
  //   }

  //   // Buscar el proveedor
  //   const provider = await this.providerRepository.findOne({ where: { id: providerId } });
  //   if (!provider) {
  //     throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   // Crear y guardar la transacción
  //   const transaction = this.transactionRepository.create({
  //     invoice,
  //     paymentReference,
  //     amount,
  //     provider,
  //     status,
  //     failureReason,
  //   });

  //   return this.transactionRepository.save(transaction);
  // }
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { invoiceId, paymentReference, amount, providerId, status, failureReason, type } = createTransactionDto;

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
      type,  // Aseguramos que el campo 'type' se pase y guarde correctamente
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

  // 


  // Método para procesar la transacción
  async processTransaction(invoiceId: string, customerId: string, paymentMethod: string) {
    // 1. Buscar la factura
    const invoice = await this.invoiceService.findOne(invoiceId);
    if (!invoice || invoice.status !== 'pending') {
      throw new NotFoundException('Factura no encontrada o ya pagada');
    }

    // 2. Buscar el proveedor de fondos
    const provider = await this.fundingProviderService.findOne(invoice.customer.provider.id);
    if (!provider) {
      throw new NotFoundException('Proveedor de fondos no encontrado');
    }

    // 3. Verificar si el proveedor tiene suficientes fondos (si aplica)
    if (paymentMethod === 'transfer' && provider.availableFunds < invoice.amount) {
      throw new BadRequestException('Fondos insuficientes del proveedor');
    }

    // 4. Registrar la transacción
  // 4. Registrar la transacción
const transaction = this.transactionRepository.create({
  invoice,  // Relación directa con la factura
  provider, // Relación directa con el proveedor de fondos
  amount: invoice.amount,  // Monto de la transacción
  status: 'completed',  // Estado de la transacción
  paymentMethod,  // Método de pago (transferencia o efectivo)
  type: 'debit',  // Tipo de transacción 
  paymentReference: invoice.paymentReference,  // Referencia del pago (puede venir de la factura)
});

// Guardar la transacción
await this.transactionRepository.save(transaction);

    await this.transactionRepository.save(transaction);

    // 5. Actualizar el capital del proveedor si se trata de una transferencia
    if (paymentMethod === 'transfer') {
      provider.availableFunds -= invoice.amount;
      await this.fundingProviderService.update(provider.id, { availableFunds: provider.availableFunds });
    }

    // 6. Actualizar el estado de la factura a pagada
    invoice.status = 'paid';
    await this.invoiceService.update(invoice.id, { status: 'paid' });

    return {
      message: 'Pago procesado con éxito',
      transactionId: transaction.id,
    };
  }
}
