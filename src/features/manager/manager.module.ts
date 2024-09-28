import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerResolver } from './manager.resolver';
import { TransactionService } from './services/transation.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './services/webhook.service';

@Module({
  imports:[HttpModule],
  exports: [WebhookService],
  providers: [ManagerResolver, ManagerService,TransactionService,WebhookService],
})
export class ManagerModule {}
