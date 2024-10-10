import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaymentProvider } from '../provider/entities/provider.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async createLink(
    createInvoiceDto: CreateInvoiceDto,
    user: any,
  ): Promise<Invoice> {
    try {
      // Generar la referencia de pago
      const paymentReference = 'ref-' + Math.random().toString().slice(2, 7);

      // Crear el link de pago con los nuevos datos
      const paymentLink = `http://localhost:5000/api/v1/payments?reference=${paymentReference}&amount=${createInvoiceDto.amount}&currency=${createInvoiceDto.currency}&numdoc=${createInvoiceDto.numdoc}&username=${createInvoiceDto.username}&userphone=${createInvoiceDto.userphone}&useremail=${createInvoiceDto.email}&typetransaction=${createInvoiceDto.typetransaction}&method=${createInvoiceDto.method}&accountNumber=${createInvoiceDto.accountNumber}&bankAgreementNumber=${createInvoiceDto.bankAgreementNumber}&paymentReceipt=${createInvoiceDto.paymentReceipt}`;

      // Crear la nueva factura con los nuevos campos
      const invoice = this.invoiceRepository.create({
        amount: createInvoiceDto.amount, //
        description: createInvoiceDto.description, //opcional
        issueDate: createInvoiceDto.issueDate, //auto
        dueDate: createInvoiceDto.dueDate, //auto
        paymentReference, //auto
        paymentLink, //auto
        status: 'pending', //auto
        numdoc: createInvoiceDto.numdoc, //obliga
        username: createInvoiceDto.username, //obliga
        userphone: createInvoiceDto.userphone, //obliga
        useremail: createInvoiceDto.email, //obliga
        typetransaction: createInvoiceDto.typetransaction, //obliga
        method: createInvoiceDto.method, //obliga
        accountNumber: createInvoiceDto.accountNumber, //obliga
        bankAgreementNumber: createInvoiceDto.bankAgreementNumber, //obliga
        paymentReceipt: createInvoiceDto.paymentReceipt, //obliga
        createdBy: user.id,
      });

      // Guardar la factura en la base de datos
      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      console.error('Error creando factura:', error);
      throw new HttpException(
        'Error al crear la factura',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkPaymentStatus(reference: string): Promise<Invoice> {
    // Buscar la factura por su referencia
    const invoice = await this.invoiceRepository.findOne({
      where: { paymentReference: reference },
    });

    // Si no se encuentra la factura, lanzar un error
    if (!invoice) {
      throw new NotFoundException(
        `Factura con referencia ${reference} no encontrada`,
      );
    }

    // Devolver la factura encontrada
    return invoice;
  }

  async getInvoicesByProvider(providerId: string): Promise<Invoice[]> {
    // Buscar las facturas asociadas al proveedor
    const invoices = await this.invoiceRepository.find({
      where: { provider: { id: providerId } }, // Suponiendo que tienes una relación entre invoices y providers
      relations: ['provider'], // Cargar la relación si es necesario
    });

    if (!invoices || invoices.length === 0) {
      throw new Error('No se encontraron facturas para este proveedor');
    }

    return invoices;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    console.log('Fetching invoice with ID:', id);  

    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    console.log('Invoice found:', invoice); 

    if (!invoice) {
        throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }

    return invoice;
}


}
