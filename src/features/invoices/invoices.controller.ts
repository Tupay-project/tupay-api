import { Controller, Post, Body, Req, UseGuards, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtGuard } from '../auth/guards/auth.guard';
import { GetInvoicesByProviderDto } from './dto/get-invoice-provider.dto';

@UseGuards(JwtGuard)  
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate-link')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {
    const user = req.user;  
    return await this.invoicesService.createLink(createInvoiceDto, user);
  }

    // Método para buscar una factura por referencia
    @Get('check-payment/:reference')
    async checkPaymentStatus(@Param('reference') reference: string) {
        const invoice = await this.invoicesService.checkPaymentStatus(reference);

        // Devolver el estado de la factura
        return {
            message: `Estado de la factura con referencia ${reference}`,
            status: invoice.status,
        };
    }
    @Post('by-provider')
    async getInvoicesByProvider(@Body() getInvoicesByProviderDto: GetInvoicesByProviderDto) {
      try {
        const result = await this.invoicesService.getInvoicesByProvider(getInvoicesByProviderDto.providerId);
        return {
          message: 'Facturas encontradas',
          result,
        };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}
