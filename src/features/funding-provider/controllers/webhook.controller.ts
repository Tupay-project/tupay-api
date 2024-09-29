import { Controller, Post, Body } from '@nestjs/common';
import { WebhookServiceTransfeProviders } from '../services/webkook-transfe_provider.service';

@Controller('webhook')
export class WebhookControllerTransfeProvider {
  constructor(private readonly webhookService: WebhookServiceTransfeProviders) {}

  @Post('transaction-status')
  async updateTransactionStatus(@Body() webhookPayload: any) {
    return this.webhookService.handleTransactionStatus(webhookPayload);
  }
}
