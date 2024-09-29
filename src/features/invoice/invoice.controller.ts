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

  // stripe
  
}
