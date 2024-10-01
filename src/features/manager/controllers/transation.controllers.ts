import { Body, Controller, NotFoundException, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../services/transation.service';

@ApiTags('Transacciones')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
 
  @Post('process-payment')
  async processTransaction(
    @Body('invoiceId') invoiceId: string,
    @Body('customerId') customerId: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    try {
      const transaction = await this.transactionService.processTransaction(
        invoiceId,
        customerId,
        paymentMethod,
      );
      return transaction;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

 
}
