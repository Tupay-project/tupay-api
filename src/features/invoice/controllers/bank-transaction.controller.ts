import { Controller, Post, Body } from '@nestjs/common';
import { BankTransactionService } from '../services/bank-transaction.service';

@Controller('bank-transactions')
export class BankTransactionController {
  constructor(private readonly transactionService: BankTransactionService) {}

  @Post('webhook')
  async handleWebhook(
    @Body('invoiceId') invoiceId: string,
    @Body('providerId') providerId: string,
    @Body('status') status: string,
  ) {
    return this.transactionService.updateTransactionStatus(invoiceId, providerId, status);
  }

  
}
