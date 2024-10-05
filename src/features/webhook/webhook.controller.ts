/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('reject')
  @ApiOperation({ summary: 'Webhook para manejar transacciones rechazadas' })
  handleReject(@Body() data: any) {
    return this.webhookService.handleReject(data);
  }

  @Post('success')
  @ApiOperation({ summary: 'Webhook para manejar transacciones exitosas' })
  handleSuccess(@Body() data: any) {
    return this.webhookService.handleSuccess(data);
  }

  @Post('fail')
  @ApiOperation({ summary: 'Webhook para manejar transacciones fallidas' })
  handleFail(@Body() data: any) {
    return this.webhookService.handleFail(data);
  }
}
