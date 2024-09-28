import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvoiceModule } from '../invoice/invoice.module';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { ManagerModule } from '../manager/manager.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService,InvoiceService,TransactionService],
  imports:[InvoiceModule,ManagerModule]
})
export class PaymentModule {}
