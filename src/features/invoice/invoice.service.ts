import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Customer } from 'src/features/customer/entities/customer.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      // Buscar el cliente
      const customer = await this.customerRepository.findOne({ where: { id: createInvoiceDto.customerId } });
      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      // Generar la referencia de pago (5 dígitos aleatorios)
      const paymentReference = Math.random().toString().slice(2, 7);

      // Usar un número de convenio por defecto si no se proporciona
      const numberAgreement = createInvoiceDto.numberAgreement || '1232';

      // Generar el link de pago (simulando el proceso de un sandbox de pago)
      const paymentLink = `http://sandbox.tupay.finance/pay?invoiceId=${paymentReference}&amount=${createInvoiceDto.amount}&currency=USD`;

      // Crear la nueva factura
      const invoice = this.invoiceRepository.create({
        customer,  // Asociar la factura con el cliente
        amount: createInvoiceDto.amount,
        description: createInvoiceDto.description,
        issueDate: createInvoiceDto.issueDate,
        dueDate: createInvoiceDto.dueDate,
        paymentReference,  // Asignar la referencia de pago generada
        numberAgreement,  // Asignar el número de convenio
        paymentLink,  // Asignar el link de pago
      });

      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      console.error('Error creando factura:', error);
      throw new HttpException('Error al crear la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findInvoiceById(invoiceId: string): Promise<Invoice> {
    try {
      return await this.invoiceRepository.findOne({ where: { id: invoiceId } });
    } catch (error) {
      console.error('Error encontrando la factura:', error);
      throw new HttpException('Error al buscar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findInvoiceAll(): Promise<Invoice[]> {
    try {
      return await this.invoiceRepository.find();
    } catch (error) {
      console.error('Error encontrando la factura:', error);
      throw new HttpException('Error al buscar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updateInvoice(invoice: Invoice): Promise<Invoice> {
    try {
      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      console.error('Error actualizando la factura:', error);
      throw new HttpException('Error al actualizar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processPayment(paymentReference: string, numberAgreement: string, paymentAmount: number): Promise<Invoice> {
    // Buscar la factura por la referencia de pago y el número de convenio
    const invoice = await this.invoiceRepository.findOne({ 
      where: { paymentReference, numberAgreement }, 
      relations: ['customer'] 
    });

    if (!invoice) {
      throw new HttpException('Invoice not found or incorrect agreement', HttpStatus.NOT_FOUND);
    }

    if (paymentAmount !== Number(invoice.amount)) {
      throw new HttpException('Payment amount does not match invoice amount', HttpStatus.BAD_REQUEST);
    }

    // Cambiar el estado a "paid" si todo está correcto
    invoice.status = 'paid';

    // Guardar el estado actualizado de la factura
    return await this.invoiceRepository.save(invoice);
  }
  async handleWebhook(invoiceId: string, paymentStatus: string): Promise<Invoice> {
    const invoice = await this.findInvoiceById(invoiceId);

    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }

    if (paymentStatus === 'success') {
      invoice.status = 'paid';
    } else if (paymentStatus === 'failed') {
      invoice.status = 'failed';
    }

    return await this.updateInvoice(invoice);
  }



}
