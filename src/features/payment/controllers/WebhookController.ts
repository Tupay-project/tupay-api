/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhookController {

  @Post('payment')
  @ApiOperation({ summary: 'Webhook para procesar notificaciones de pago' })
  handlePaymentWebhook(@Body() webhookPayload: any) {
    return 'Webhook de pago procesado';
  }

  @Post('top-up')
  @ApiOperation({ summary: 'Webhook para procesar notificaciones de recargas' })
  handleTopUpWebhook(@Body() webhookPayload: any) {
    return 'Webhook de recarga procesado';
  }
  
  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment success'
    };
  }

  @Get('cancelled')
  cancel() {
    return {
      ok: true,
      message: 'Payment cancelled'
    };
  }
}
