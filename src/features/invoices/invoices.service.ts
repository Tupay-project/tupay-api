import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>, 
    ){}

    async createLink(createInvoiceDto: CreateInvoiceDto, user: any): Promise<Invoice> {
        try {
            // Generar la referencia de pago (5 dígitos aleatorios) y agregar el prefijo 'ref-'
            const paymentReference = 'ref-' + Math.random().toString().slice(2, 7);

            // Crear el link de pago con todos los datos necesarios
            const paymentLink = `http://localhost:5000/api/v1/payments?reference=${paymentReference}&amount=${createInvoiceDto.amount}&currency=${createInvoiceDto.currency}&numdoc=${createInvoiceDto.numdoc}&username=${createInvoiceDto.username}&userphone=${createInvoiceDto.userphone}&useremail=${createInvoiceDto.email}&typetransaction=${createInvoiceDto.typetransaction}&method=${createInvoiceDto.method}`;
            
            // Crear la nueva factura con el link de pago generado
            const invoice = this.invoiceRepository.create({
                amount: createInvoiceDto.amount,
                description: createInvoiceDto.description,
                issueDate: createInvoiceDto.issueDate,
                dueDate: createInvoiceDto.dueDate,
                paymentReference,  // Asignar la referencia de pago generada
                paymentLink,  // Asignar el link de pago generado
                status: 'pending',  // Establecer el estado de la factura como 'pending'
                numdoc: createInvoiceDto.numdoc,  // Aseguramos que el numdoc se pase correctamente
                username: createInvoiceDto.username,
                userphone: createInvoiceDto.userphone,
                useremail: createInvoiceDto.email,
                typetransaction: createInvoiceDto.typetransaction,
                method: createInvoiceDto.method,
                createdBy: user.id  // Usamos el ID del usuario autenticado
            });

            // Guardar la factura en la base de datos
            return await this.invoiceRepository.save(invoice);
        } catch (error) {
            console.error('Error creando factura:', error);
            throw new HttpException('Error al crear la factura', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

     // Nuevo método para buscar por referencia y verificar estado
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
}

