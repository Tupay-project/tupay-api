import { Controller, Post, Body, HttpException, HttpStatus, Get, NotFoundException, Param } from '@nestjs/common';
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
  @Get(':invoiceId')
@ApiOperation({ summary: 'Obtener una factura por su ID' })
@ApiResponse({ status: 200, description: 'Factura obtenida con éxito' })
@ApiResponse({ status: 404, description: 'Factura no encontrada' })
@ApiResponse({ status: 500, description: 'Error al obtener la factura' })
async findInvoiceById(@Param('invoiceId') invoiceId: string): Promise<Invoice> {
  try {
    const invoice = await this.invoiceService.findInvoiceById(invoiceId);
    return invoice;
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}



  @Get('initiate-payment/:customerId/:invoiceReference')
  async initiatePayment(
    @Param('customerId') customerId: string,
    @Param('invoiceReference') invoiceReference: string,
  ) {
    try {
      const paymentDetails = await this.invoiceService.initiatePayment(
        customerId,
        invoiceReference,
      );
      return paymentDetails;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
}
