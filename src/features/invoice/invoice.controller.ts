import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Invoice } from './entities/invoice.entity';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiResponse({ status: 201, description: 'Factura creada con éxito' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 500, description: 'Error al crear la factura' })
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    try {
      const invoice = await this.invoiceService.createInvoice(createInvoiceDto);
      return invoice; // Aquí se devolverá la factura con el link de pago
    } catch (error) {
      console.error('Error en el controlador de factura:', error);
      throw new HttpException('Error al procesar la solicitud de factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // @Post('pay')
  // @ApiOperation({ summary: 'Procesar el pago de una factura' })
  // @ApiResponse({ status: 200, description: 'Pago procesado con éxito' })
  // @ApiResponse({ status: 400, description: 'El monto del pago no coincide con el monto de la factura' })
  // @ApiResponse({ status: 404, description: 'Factura no encontrada o número de convenio incorrecto' })
  // async payInvoice(
  //   @Body('paymentReference') paymentReference: string,
  //   @Body('numberAgreement') numberAgreement: string,
  //   @Body('paymentAmount') paymentAmount: number
  // ) {
  //   try {
  //     const invoice = await this.invoiceService.processPayment(paymentReference, numberAgreement, paymentAmount);
  //     return { message: 'Pago procesado con éxito', invoice };
  //   } catch (error) {
  //     // Captura de error con detalle del mismo
  //     console.error('Error processing payment:', error.message);
  //     throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @Post('webhook')
  // @ApiOperation({ summary: 'Recibir notificación de pago desde un proveedor externo' })
  // @ApiResponse({ status: 200, description: 'Webhook recibido y procesado' })
  // @ApiResponse({ status: 500, description: 'Error al procesar el webhook' })
  // async receiveWebhook(@Body() webhookData: { invoiceId: string; paymentStatus: string }) {
  //   try {
  //     const invoice = await this.invoiceService.handleWebhook(webhookData.invoiceId, webhookData.paymentStatus);
  //     return { message: `Invoice status updated to ${invoice.status}`, invoice };
  //   } catch (error) {
  //     throw new HttpException(error.message || 'Error al procesar el webhook', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ status: 200, description: 'Lista de facturas obtenida con éxito' })
  @ApiResponse({ status: 500, description: 'Error al obtener las facturas' })
  async findAllInvoices(): Promise<Invoice[]> {
    try {
      return await this.invoiceService.findInvoiceAll();
    } catch (error) {
      throw new HttpException('Error al obtener las facturas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
