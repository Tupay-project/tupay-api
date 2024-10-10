import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtGuard } from '../auth/guards/auth.guard';

@UseGuards(JwtGuard)  // Usamos el guard para extraer el usuario del JWT
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate-link')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {
    const user = req.user;  // Obtener el usuario autenticado desde el JWT
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
}
