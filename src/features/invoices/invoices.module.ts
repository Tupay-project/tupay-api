import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PaymentsService } from '../payment/payment.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService,PaymentsService],
})
export class InvoicesModule {}
