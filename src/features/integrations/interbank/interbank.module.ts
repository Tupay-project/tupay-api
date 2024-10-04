import { Module } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { InterbankController } from './interbank.controller';
import { CashInController,CashInService,CashOutController,CashOutService } from '.';

@Module({
  controllers: [InterbankController,CashInController,CashOutController],
  providers: [InterbankService,CashInService,CashOutService]
})
export class InterbankModule {}
