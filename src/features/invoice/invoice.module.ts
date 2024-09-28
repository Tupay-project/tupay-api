import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { BankTransactionController } from './controllers/bank-transaction.controller';
import { BankTransactionService } from './services/bank-transaction.service';

@Module({
  controllers: [InvoiceController,BankTransactionController],
  providers: [InvoiceService,BankTransactionService],
})
export class InvoiceModule {}
