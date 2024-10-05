/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { ApiOperation, ApiParam, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('interbank')
@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}

  // Excluir estos endpoints POST de la documentación Swagger
  @ApiExcludeEndpoint()
  @Post('send-transaction-confirmation')
  sendTransactionConfirmationEmail() {
    return this.interbankService.sendTransactionConfirmationEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-payment-receipt')
  sendPaymentReceiptEmail() {
    return this.interbankService.sendPaymentReceiptEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-withdrawal-notification')
  sendWithdrawalNotificationEmail() {
    return this.interbankService.sendWithdrawalNotificationEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-error-notification')
  sendErrorNotificationEmail() {
    return this.interbankService.sendErrorNotificationEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-account-activation')
  sendAccountActivationEmail() {
    return this.interbankService.sendAccountActivationEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-password-reset')
  sendPasswordResetEmail() {
    return this.interbankService.sendPasswordResetEmail();
  }

  @ApiExcludeEndpoint()
  @Post('send-custom-notification')
  sendCustomNotificationEmail(@Body() notificationData: any) {
    return this.interbankService.sendCustomNotificationEmail();
  }

  // Métodos GET que sí quieres mostrar en Swagger
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @Get('transactions')
  getAllTransactions() {
    return { message: 'Aquí estará disponible el método para obtener todas las transacciones.' };
  }

  @ApiOperation({ summary: 'Obtener transacción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la transacción', type: String })
  @Get('transaction/:id')
  getTransactionById(@Param('id') id: string) {
    return { message: `Aquí estará disponible el método para obtener la transacción con ID: ${id}.` };
  }

  @ApiOperation({ summary: 'Obtener todos los clientes del banco' })
  @Get('clients')
  getAllClients() {
    return { message: 'Aquí estará disponible el método para obtener todos los clientes del banco.' };
  }

  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente', type: String })
  @Get('client/:id')
  getClientById(@Param('id') id: string) {
    return { message: `Aquí estará disponible el método para obtener el cliente con ID: ${id}.` };
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas bancarias' })
  @Get('accounts')
  getAllAccounts() {
    return { message: 'Aquí estará disponible el método para obtener todas las cuentas bancarias.' };
  }

  @ApiOperation({ summary: 'Obtener cuenta bancaria por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cuenta bancaria', type: String })
  @Get('account/:id')
  getAccountById(@Param('id') id: string) {
    return { message: `Aquí estará disponible el método para obtener la cuenta bancaria con ID: ${id}.` };
  }

  @ApiOperation({ summary: 'Obtener todas las transacciones pendientes' })
  @Get('pending-transactions')
  getPendingTransactions() {
    return { message: 'Aquí estará disponible el método para obtener todas las transacciones pendientes.' };
  }

  @ApiOperation({ summary: 'Obtener saldo total del banco' })
  @Get('total-balance')
  getTotalBankBalance() {
    return { message: 'Aquí estará disponible el método para obtener el saldo total del banco.' };
  }

  @ApiOperation({ summary: 'Obtener todos los movimientos de una cuenta bancaria' })
  @ApiParam({ name: 'accountId', description: 'ID de la cuenta bancaria', type: String })
  @Get('account/:accountId/movements')
  getAccountMovements(@Param('accountId') accountId: string) {
    return { message: `Aquí estará disponible el método para obtener los movimientos de la cuenta bancaria con ID: ${accountId}.` };
  }

  @ApiOperation({ summary: 'Obtener tasa de cambio actual' })
  @Get('exchange-rate')
  getExchangeRate() {
    return { message: 'Aquí estará disponible el método para obtener la tasa de cambio actual.' };
  }
}
