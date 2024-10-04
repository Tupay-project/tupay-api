import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CashOutService } from '..';

@Controller('cashout')
export class CashOutController {
  constructor(private readonly cashOutService: CashOutService) {}

  // Endpoint para solicitar el retiro de fondos
  @Post('request-withdrawal')
  requestWithdrawal(@Body('clientId') clientId: number, @Body('amount') amount: number) {
    return this.cashOutService.requestWithdrawal(clientId, amount);
  }

  // Endpoint para procesar el pago de un retiro
  @Post('process-payout')
  processPayout(@Body('withdrawalId') withdrawalId: number) {
    return this.cashOutService.processPayout(withdrawalId);
  }

  // Endpoint para descargar comprobante de pago de salida
  @Get('download-payout-receipt/:withdrawalId')
  downloadPayoutReceipt(@Param('withdrawalId') withdrawalId: number) {
    return this.cashOutService.downloadPayoutReceipt(withdrawalId);
  }

  // Endpoint para verificar el estado de un retiro
  @Get('check-withdrawal-status/:withdrawalId')
  checkWithdrawalStatus(@Param('withdrawalId') withdrawalId: number) {
    return this.cashOutService.checkWithdrawalStatus(withdrawalId);
  }

  // Endpoint para finalizar el retiro
  @Post('finalize-payout')
  finalizePayout(@Body('withdrawalId') withdrawalId: number) {
    return this.cashOutService.finalizePayout(withdrawalId);
  }
}
