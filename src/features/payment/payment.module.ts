import { Module } from '@nestjs/common';
import {PaymentsService  } from './payment.service';
import { PaymentsController } from './payment.controller';
import { ProviderService } from '../provider/provider.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService,ProviderService],
  exports:[PaymentsService]
})
export class PaymentModule {}
