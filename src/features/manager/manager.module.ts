import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerResolver } from './manager.resolver';
import { TransactionService } from './services/transation.service';

@Module({
  providers: [ManagerResolver, ManagerService,TransactionService],
})
export class ManagerModule {}
