/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnterBasicDataDto } from './dtos/EnterBasicDataDto';
import { GenerateTransactionDto } from './dtos/GenerateTransactionDto';

@ApiTags('interbank')
@Controller('interbank')
export class InterbankController {
  // 1. SGW - Recibe nombre y monto
  @Post('receive-parameters')
  @ApiOperation({ summary: 'Recibe nombre y monto para procesar' })
  receiveParameters(@Body() enterBasicDataDto: EnterBasicDataDto) {
    const { customerData } = enterBasicDataDto;
    // Aquí va la lógica para manejar la recepción de nombre y monto
    return {
      message: 'Parámetros recibidos correctamente',
      data: customerData,
    };
  }

  // 2. obtener respuesta de pago
  @Get('payment-response/:paymentId')
  @ApiOperation({ summary: 'Obtiene la respuesta de un pago' })
  getPaymentResponse(@Param('paymentId') paymentId: string) {
    return {
      message: 'Respuesta de pago obtenida',
      paymentId,
    };
  }

  // 3. Consulta modelos de pago
  @Get('payment-models')
  @ApiOperation({ summary: 'Consulta los modelos de pago disponibles' })
  getPaymentModels() {
    return {
      message: 'Modelos de pago consultados',
      models: [], // Aquí añadirías la lista de modelos si estuvieran disponibles
    };
  }

  // 4. Guardar sesión de usuario
  @Post('save-session')
  @ApiOperation({ summary: 'Guarda la sesión del usuario' })
  saveSession(@Body() body: { userId: string }) {
    const { userId } = body;
    return {
      message: 'Sesión de usuario guardada',
      userId,
    };
  }

  // 5. Validar datos del usuario (Email/Nombre)
  @Post('validate-user')
  @ApiOperation({ summary: 'Valida los datos del usuario por email o nombre' })
  validateUser(@Body() enterBasicDataDto: EnterBasicDataDto) {
    const { customerData } = enterBasicDataDto;
    return {
      message: 'Datos del usuario validados',
      customerData,
    };
  }

  // 6. Guardar pago seleccionado por el usuario
  @Post('save-payment')
  @ApiOperation({ summary: 'Guarda el pago seleccionado por el usuario' })
  savePayment(@Body() generateTransactionDto: GenerateTransactionDto) {
    const { facturaId, clientId } = generateTransactionDto;
    return {
      message: 'Pago guardado correctamente',
      facturaId,
      clientId,
    };
  }
}
