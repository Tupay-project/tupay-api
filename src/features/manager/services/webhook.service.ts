import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  async notifyProvider(paymentData: any): Promise<void> {
    const webhookUrl = paymentData.customer.provider.webhookUrl;

    if (!webhookUrl) {
      console.log('El proveedor no tiene un webhookUrl configurado, no se enviará la notificación.');
      return;  // No lanza excepción si no hay webhookUrl
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(webhookUrl, {
          invoiceId: paymentData.id,
          amount: paymentData.amount,
          status: paymentData.status,
          paymentReference: paymentData.paymentReference,
          customer: paymentData.customer,
        })
      );

      if (response.status !== 200) {
        throw new HttpException('Webhook notification failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      console.log('Webhook enviado con éxito:', response.data);
    } catch (error) {
      console.error('Error enviando el webhook:', error);
      throw new HttpException('Error enviando la notificación de pago', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
