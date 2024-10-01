import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvoiceModule } from '../invoice/invoice.module';
import { InvoiceService } from '../invoice/invoice.service';
import { TransactionService } from '../manager/services/transation.service';
import { WebhookService } from '../manager/services/webhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../manager/entities/payment.entity'; // Importa la entidad Payment
import { HttpModule } from '@nestjs/axios';
import { CustomerModule } from '../customer/customer.module';
import { FundingProviderModule } from '../funding-provider/funding-provider.module';

@Module({
  controllers: [
    PaymentController,

  ],
  providers: [PaymentService, InvoiceService, TransactionService, WebhookService],
  imports: [
    InvoiceModule,
    TypeOrmModule.forFeature([Payment]),
    HttpModule,
    CustomerModule,
    FundingProviderModule
  ],
  exports:[PaymentService, InvoiceService, TransactionService, WebhookService]
})
export class PaymentModule {}
