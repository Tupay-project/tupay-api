/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InterbankService } from './interbank.service';

@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}

  // Endpoint para enviar confirmación de transacción por correo
  @Post('send-transaction-confirmation')
  sendTransactionConfirmationEmail() {
    return this.interbankService.sendTransactionConfirmationEmail();
  }

  // Endpoint para enviar recibo de pago por correo
  @Post('send-payment-receipt')
  sendPaymentReceiptEmail() {
    return this.interbankService.sendPaymentReceiptEmail();
  }

  // Endpoint para enviar notificación de retiro por correo
  @Post('send-withdrawal-notification')
  sendWithdrawalNotificationEmail() {
    return this.interbankService.sendWithdrawalNotificationEmail();
  }

  // Endpoint para enviar notificación de error por correo
  @Post('send-error-notification')
  sendErrorNotificationEmail() {
    return this.interbankService.sendErrorNotificationEmail();
  }

  // Endpoint para enviar activación de cuenta por correo
  @Post('send-account-activation')
  sendAccountActivationEmail() {
    return this.interbankService.sendAccountActivationEmail();
  }

  // Endpoint para enviar restablecimiento de contraseña por correo
  @Post('send-password-reset')
  sendPasswordResetEmail() {
    return this.interbankService.sendPasswordResetEmail();
  }

  // Endpoint para enviar una notificación personalizada por correo
  @Post('send-custom-notification')
  sendCustomNotificationEmail(@Body() notificationData: any) {
    return this.interbankService.sendCustomNotificationEmail();
  }
}
