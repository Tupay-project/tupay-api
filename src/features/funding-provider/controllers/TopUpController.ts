/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller('payments/top-ups')
@ApiTags('Top-ups')
export class TopUpController {
  
  @Post('request')
  @ApiOperation({ summary: 'Solicitar recarga para el proveedor' })
  requestTopUp(@Body() topUpRequestDto: any) {
    return 'Solicitud de recarga recibida';
  }

  @Post('process/:topUpId')
  @ApiOperation({ summary: 'Procesar una recarga' })
  @ApiParam({ name: 'topUpId', description: 'ID de la recarga a procesar' })
  processTopUp(@Param('topUpId') topUpId: string) {
    return `Recarga procesada para el ID ${topUpId}`;
  }

  @Post('confirm/:topUpId')
  @ApiOperation({ summary: 'Confirmar una recarga' })
  @ApiParam({ name: 'topUpId', description: 'ID de la recarga a confirmar' })
  confirmTopUp(@Param('topUpId') topUpId: string) {
    return `Recarga confirmada para el ID ${topUpId}`;
  }

  @Get('provider/:providerId/balance')
  @ApiOperation({ summary: 'Obtener el saldo del proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  getProviderBalance(@Param('providerId') providerId: string) {
    return `Saldo del proveedor ${providerId}`;
  }

  @Post('create-transaction')
  @ApiOperation({ summary: 'Crear transacción de recarga' })
  createTopUpTransaction(@Body() topUpTransactionDto: any) {
    return 'Transacción de recarga creada';
  }

  @Get('provider/:providerId/history')
  @ApiOperation({ summary: 'Obtener el historial de recargas del proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  getTopUpHistory(@Param('providerId') providerId: string) {
    return `Historial de recargas del proveedor ${providerId}`;
  }
}
