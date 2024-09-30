/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiOperation } from '@nestjs/swagger';
import { Request,Response } from 'express';
import { ProviderTopUpService } from '../funding-provider/services/ProviderTopUpService';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly providerTopUpService: ProviderTopUpService,

  ) {}


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

  // 

  // @Post('providers/success')
  // @ApiOperation({ summary: 'Proceso de éxito tras el pago del proveedor' })
  // successProvider(@Req()req:Request,@Res() res:Response) {
  // console.log('providers/success')
  //   return  this.providerTopUpService.stripeWebHoook(req,res)
  // }

  @Post('stripe-webhook')
@ApiOperation({ summary: 'Webhook de Stripe para procesar eventos' })
async stripeWebhook(@Req() req: Request, @Res() res: Response) {
  return this.providerTopUpService.stripeWebHoook(req, res);
}

@Post('providers/success')  // <- Este es el método que debe recibir el POST desde Hookdeck
@ApiOperation({ summary: 'Proceso de éxito tras el pago del proveedor' })
successProvide(@Req() req: Request, @Res() res: Response) {
  console.log('providers/success');
  return this.providerTopUpService.stripeWebHoook(req, res);
}

  @Get('providers/success')
@ApiOperation({ summary: 'Redirección de éxito tras el pago del proveedor' })
successProvider(@Req()req:Request,@Res() res:Response) {
  console.log('providers/success');
  return res.status(200).json({
    ok: true,
    message: 'Provider payment success'
  });
}


  // Webhook de cancelación para el proveedor tras la recarga
  // @Post('providers/cancelled')
  // @ApiOperation({ summary: 'Proceso de cancelación tras el pago del proveedor' })
  // cancelProviderd() {
  //   return {
  //     ok: true,
  //     message: 'Provider payment cancelled'
  //   };
  // }

  @Get('providers/cancelled')
  @ApiOperation({ summary: 'Redirección de cancelación tras el pago del proveedor' })
  cancelProvider() {
    return {
      ok: true,
      message: 'Provider payment cancelled',
    };
  }


}
