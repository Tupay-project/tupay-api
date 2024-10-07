import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerResolver } from './manager.resolver';

@Module({
<<<<<<< HEAD
  imports:[
    // InvoiceModule,
    HttpModule,
    // FundingProviderModule,
    CustomerModule,
    PaymentModule
  ],
  controllers:[TransactionController],
  exports: [WebhookService],
  providers: [ManagerResolver, ManagerService,TransactionService,WebhookService],
=======
  providers: [ManagerResolver, ManagerService],
>>>>>>> features/integratins/interback
})
export class ManagerModule {}
