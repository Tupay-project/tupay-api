/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('invoices-payment')
@ApiTags('invoices-payment')
export class InvoiceControllerPayment {
  
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva factura' })
  createInvoice(@Body() createInvoiceDto: any) {
    return 'Factura creada';
  }

  @Get(':invoiceId')
  @ApiOperation({ summary: 'Obtener detalles de una factura por ID' })
  @ApiParam({ name: 'invoiceId', description: 'ID de la factura' })
  getInvoiceById(@Param('invoiceId') invoiceId: string) {
    return `Detalles de la factura ${invoiceId}`;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener todas las facturas de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  getUserInvoices(@Param('userId') userId: string) {
    return `Lista de facturas del usuario ${userId}`;
  }
}


