import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerResolver } from './manager.resolver';
import { TransactionService } from './services/transation.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './services/webhook.service';
import { FundingProviderModule } from '../funding-provider/funding-provider.module';
import { CustomerModule } from '../customer/customer.module';
import { PaymentModule } from '../payment/payment.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports:[
    InvoiceModule,
    HttpModule,
    FundingProviderModule,
    CustomerModule,
    PaymentModule
  ],
  exports: [WebhookService],
  providers: [ManagerResolver, ManagerService,TransactionService,WebhookService],
})
export class ManagerModule {}
