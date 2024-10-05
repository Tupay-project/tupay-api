/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  constructor(){
    
  }
  
  // Webhook para manejo de rechazo
  handleReject(data: any) {
    // Lógica para manejar el webhook de rechazo
    return {
      message: 'Webhook recibido - Transacción rechazada',
      data,
    };
  }

  // Webhook para manejo de éxito
  handleSuccess(data: any) {
    // Lógica para manejar el webhook de éxito
    return {
      message: 'Webhook recibido - Transacción exitosa',
      data,
    };
  }

  // Webhook para manejo de fallo
  handleFail(data: any) {
    // Lógica para manejar el webhook de fallo
    return {
      message: 'Webhook recibido - Transacción fallida',
      data,
    };
  }
}
