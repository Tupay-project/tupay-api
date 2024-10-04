/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { CloudinaryService } from 'src/shared/modules/cloudinary/cloudinary.service';
import { PrinterService } from 'src/shared/modules/printer/printer.service';
import { Repository } from 'typeorm';

@Injectable()
export class CashInService  {
  
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly printerService: PrinterService,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,  // Repositorio para la entidad Invoice
  ) {}


  async generateAndUploadInvoice(clientData: any, invoiceDetails: any[], totalAmount: number): Promise<string> {
    const pdfDoc = this.printerService.createInvoicePdf(clientData, invoiceDetails, totalAmount, 'INV-123', new Date().toISOString(), 'CNV-001');
    
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', async () => {
        const buffer = Buffer.concat(chunks);

        const file: Express.Multer.File = {
          buffer: buffer,
          originalname: 'factura.pdf',
          mimetype: 'application/pdf',
          fieldname: '',
          encoding: '',
          size: buffer.length,
          stream: null, 
          destination: '',
          filename: '',
          path: ''
        };

        try {
          const pdfUrl = await this.cloudinaryService.uploadFile(file, { folder: 'invoices' });

          // Crear la nueva factura
          const invoice = new Invoice();
          invoice.clientName = clientData.name;
          invoice.totalAmount = totalAmount;
          invoice.amount = totalAmount; // Aquí asegúrate de asignar el total a la columna 'amount'
          invoice.pdfUrl = pdfUrl;  // Guardar el enlace en la base de datos
          invoice.issueDate = new Date();  // Fecha actual como fecha de emisión
          invoice.description = invoiceDetails.map(item => item.description).join(', '); // Agregar descripciones de los detalles
          invoice.status = 'pending';  // Estado predeterminado
          invoice.numberAgreement = '1232'; // Número de convenio, si es fijo

          await this.invoiceRepository.save(invoice);

          resolve(pdfUrl);  // Retorna la URL del PDF subido
        } catch (error) {
          reject(error);
        }
      });

      pdfDoc.end();
    });
  }


  // Otros métodos de CashInService, como generar la transacción, seleccionar el método de pago, etc.
  generateTransaction(facturaId: number, clientId: number): any {
    // Lógica para generar una transacción
  }
  
  selectPaymentMethod(transactionId: number, paymentMethod: string): any {
    // Lógica para seleccionar el método de pago
  }

  enterBasicData(transactionId: number, customerData: any): any {
    // Lógica para capturar los datos del cliente
  }

  completeTransaction(transactionId: number): any {
    // Lógica para completar la transacción
  }

  downloadReceipt(transactionId: number): any {
    // Lógica para descargar el recibo
  }

  finalizeTransaction(transactionId: number): any {
    // Lógica para finalizar la transacción
  }
}
