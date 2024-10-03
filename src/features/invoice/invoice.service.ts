import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { FundingProvider } from '../funding-provider/entities/provider.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>, 

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,

    private readonly customerService: CustomerService, 

  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      // Buscar el cliente
      const customer = await this.customerRepository.findOne({ where: { id: createInvoiceDto.customerId } });
      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }
    // Validar que la fecha de vencimiento no sea anterior a la fecha de emisión
        if (createInvoiceDto.dueDate < createInvoiceDto.issueDate) {
            throw new HttpException('The due date cannot be earlier than the issue date', HttpStatus.BAD_REQUEST);
        }
      // Generar la referencia de pago (5 dígitos aleatorios) y agregar el prefijo 'ref-'
      const paymentReference = 'ref-' + Math.random().toString().slice(2, 7);
  
      // Usar un número de convenio por defecto si no se proporciona
      const numberAgreement = createInvoiceDto.numberAgreement || '1232';
  
      // Generar el link de pago (antes de guardar la factura)
      const paymentLink = `http://localhost:5000/api/v1/payments?invoiceId=${paymentReference}&amount=${createInvoiceDto.amount}&currency=USD&numberAgreement=${numberAgreement}`;
  
   // Buscar el proveedor del cliente
   const provider = await this.providerRepository.findOne({ where: { id: customer.provider.id } });
   if (!provider) {
       throw new HttpException('Provider not found for this customer', HttpStatus.NOT_FOUND);
   }


      // Crear la nueva factura con el link de pago generado
      const invoice = this.invoiceRepository.create({
        customer,  // Asociar la factura con el cliente
        provider,  // Asociar la factura con el proveedor
        amount: createInvoiceDto.amount,
        description: createInvoiceDto.description,
        issueDate: createInvoiceDto.issueDate,
        dueDate: createInvoiceDto.dueDate,
        paymentReference,  // Asignar la referencia de pago generada (con prefijo)
        numberAgreement,  // Asignar el número de convenio
        paymentLink,  // Asignar el link de pago generado
        status: 'pending',  // Aseguramos que el estado sea 'pending'
      });
  
      // Guardar la factura en la base de datos
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
  // 

  async initiatePayment(customerId: string, invoiceReference: string) {
    // Verificar que el cliente existe
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Buscar la factura pendiente
    const invoice = await this.invoiceRepository.findOne({
      where: { paymentReference: invoiceReference, status: 'pending' },
    });

    // Si no se encuentra la factura o ya está pagada
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada o ya está pagada');
    }

    // Validar si el monto de la factura es correcto
    if (invoice.amount <= 0) {
      throw new BadRequestException('Monto de la factura no es válido');
    }

    // Preparar los detalles de la transacción (sin aún procesarla)
    const paymentDetails = {
      invoiceId: invoice.id,
      amount: invoice.amount,
      paymentReference: invoice.paymentReference,
      description: invoice.description,
      customerId: customer.id,
    };

    // Devolver los detalles de la transacción, listo para ser procesado en el futuro
    return {
      message: 'Factura lista para ser pagada',
      paymentDetails,
    };
  }

   // Método para buscar una factura por ID
   async findOne(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    return invoice;
  }
  // Método para actualizar una factura
  async update(invoiceId: string, updateData: Partial<Invoice>): Promise<Invoice> {
    await this.invoiceRepository.update(invoiceId, updateData);
    const updatedInvoice = await this.findOne(invoiceId);
    return updatedInvoice;
  }



}
