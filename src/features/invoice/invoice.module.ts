import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { BankTransactionController } from './controllers/bank-transaction.controller';
import { BankTransactionService } from './services/bank-transaction.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  controllers: [InvoiceController,BankTransactionController],
  providers: [InvoiceService,BankTransactionService,CustomerService],
  exports:[InvoiceService,BankTransactionService],
  imports:[CustomerModule]
})
export class InvoiceModule {}
