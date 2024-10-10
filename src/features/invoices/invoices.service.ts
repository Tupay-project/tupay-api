import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
    
    ){}

    async createLink(createInvoiceDto: CreateInvoiceDto, user: any): Promise<{ paymentLink: string }> {
        try {
            // Generar la referencia de pago
            const paymentReference = 'ref-' + Math.random().toString().slice(2, 7);
    
            // Crear el link de pago con todos los datos necesarios
            const paymentLink = `http://localhost:5000/api/v1/payments?reference=${paymentReference}&amount=${createInvoiceDto.amount}&currency=${createInvoiceDto.currency}&numdoc=${createInvoiceDto.numdoc}&username=${createInvoiceDto.username}&userphone=${createInvoiceDto.userphone}&useremail=${createInvoiceDto.email}&typetransaction=${createInvoiceDto.typetransaction}&method=${createInvoiceDto.method}&accountNumber=${createInvoiceDto.accountNumber}&bankAgreementNumber=${createInvoiceDto.bankAgreementNumber}&paymentReceipt=${createInvoiceDto.paymentReceipt}`;
    
            // Crear la nueva factura con los datos proporcionados
            const invoice = this.invoiceRepository.create({
                amount: createInvoiceDto.amount,
                description: createInvoiceDto.description,
                issueDate: createInvoiceDto.issueDate,
                dueDate: createInvoiceDto.dueDate,
                paymentReference,
                paymentLink,
                status: 'pending',
                numdoc: createInvoiceDto.numdoc,
                username: createInvoiceDto.username,
                userphone: createInvoiceDto.userphone,
                useremail: createInvoiceDto.email,
                typetransaction: createInvoiceDto.typetransaction,
                method: createInvoiceDto.method,
                accountNumber: createInvoiceDto.accountNumber,
                bankAgreementNumber: createInvoiceDto.bankAgreementNumber,
                paymentReceipt: createInvoiceDto.paymentReceipt,
                createdBy: user.id
            });
    
            // Guardar la factura en la base de datos
            await this.invoiceRepository.save(invoice);
    
            // Devolver solo el paymentLink en la respuesta
            return { paymentLink };
        } catch (error) {
            console.error('Error creando factura:', error);
            throw new HttpException('Error al crear la factura', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
     async checkPaymentStatus(reference: string): Promise<Invoice> {
        // Buscar la factura por su referencia
        const invoice = await this.invoiceRepository.findOne({ where: { paymentReference: reference } });

        // Si no se encuentra la factura, lanzar un error
        if (!invoice) {
            throw new NotFoundException(`Factura con referencia ${reference} no encontrada`);
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
}

