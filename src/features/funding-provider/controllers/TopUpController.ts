import { Controller, Post, Body,Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProviderTopUpService } from '../services/ProviderTopUpService';
import { ApiKeyGuard } from '../guard/api-key.guard';
import { AddProviderFundsDto } from '../dto/AddProviderFundsDto';

@ApiTags('ProviderTopUp')
@Controller('funding-provider')
@UseGuards(ApiKeyGuard)  // Usamos el guard aquí para proteger las rutas
export class ProviderTopUpController {

  constructor(private readonly providerTopUpService: ProviderTopUpService) {}

  @Post('top-up')
  async initiateTopUp(@Body() addProviderFundsDto: AddProviderFundsDto) {
    const { amount, providerId, currency } = addProviderFundsDto;
  
    // Lógica de la recarga
    const { paymentLink, paymentReference } = await this.providerTopUpService.initiateTopUp(addProviderFundsDto);
    
    return {

      message: 'Recarga iniciada exitosamente. Completa el pago en el siguiente enlace.',
      paymentLink,
      paymentReference, 
      amount,
      providerId,
      currency
    };
  }
  


  
  @Post('create-transaction/:providerId')
  @ApiOperation({ summary: 'Crear transacción de recarga de fondos' })
  async createTopUpTransaction(
    @Param('providerId') providerId: string, 
    @Body('amount') amount: number
  ): Promise<void> {
    await this.providerTopUpService.createTopUpTransaction(providerId, amount);
  }

  @Post('confirm/:providerId')
  @ApiOperation({ summary: 'Confirmar recarga de fondos después del pago' })
  async confirmTopUp(
    @Param('providerId') providerId: string, 
   
  ): Promise<void> {
    await this.providerTopUpService.confirmTopUp(providerId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Procesar webhook de Stripe' })
  async handleTopUpWebhook(@Body() webhookData: any): Promise<void> {
    // Llamada al servicio para manejar el webhook de Stripe
    await this.providerTopUpService.handleTopUpWebhook(webhookData);
  }


  @Post('update-balance/:providerId')
  @ApiOperation({ summary: 'Actualizar saldo del proveedor' })
  async updateProviderBalance(
    @Param('providerId') providerId: string, 
    @Body('amount') amount: number
  ): Promise<void> {
    await this.providerTopUpService.updateProviderBalance(providerId, amount);
  }
}
