import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InterbankService } from './interbank.service';
import { CreateSessionDto } from './dtos/create-session.dto';

@ApiTags('Interbank') // Categoría en Swagger
@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}

  @ApiOperation({ summary: 'Crear una sesión de pago' }) // Descripción de la operación
  @ApiResponse({ status: 201, description: 'Sesión de pago creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiBody({ type: CreateSessionDto }) // Documentación del cuerpo del request
  @Post('create-session')
  async createPaymentSession(
    @Body() createInterbankDto: CreateSessionDto,
  ): Promise<{ sessionId: string }> {
    const sessionId =
      await this.interbankService.createPaymentSession(createInterbankDto);
    return { sessionId };
  }

  @ApiOperation({ summary: 'Procesar un pago' })
  @ApiParam({ name: 'sessionId', description: 'ID de la sesión de pago' }) // Parámetro en la URL
  @ApiResponse({ status: 200, description: 'Pago procesado correctamente.' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada.' })
  @Post('process-payment/:sessionId')
  async processPayment(
    @Param('sessionId') sessionId: string,
  ): Promise<{ status: string; message: string }> {
    return await this.interbankService.processPayment(sessionId);
  }

  @ApiOperation({ summary: 'Obtener el estado del pago' })
  @ApiParam({ name: 'sessionId', description: 'ID de la sesión de pago' })
  @ApiResponse({ status: 200, description: 'Estado del pago obtenido correctamente.' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada.' })
  @Get('payment-status/:sessionId')
  async getPaymentStatus(
    @Param('sessionId') sessionId: string,
  ): Promise<{ status: string }> {
    const status = await this.interbankService.getPaymentStatus(sessionId);
    return { status };
  }
}
