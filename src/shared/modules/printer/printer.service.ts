/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const PdfPrinter = require('pdfmake');
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  // Método para generar la factura PDF
  createInvoicePdf(
    clientData: any,
    invoiceDetails: any[],
    totalAmount: number,
    invoiceNumber: string,
    issueDate: string,
    convenioNumber: string
  ) {
    // Definición del contenido del PDF
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Factura', style: 'header' },
        { text: `Número de Factura: ${invoiceNumber}`, margin: [0, 10, 0, 10] },
        { text: `Cliente: ${clientData.name}`, margin: [0, 10, 0, 10] },
        { text: `Fecha de Emisión: ${issueDate}`, margin: [0, 10, 0, 10] },
        { text: `Número de Convenio: ${convenioNumber}`, margin: [0, 10, 0, 20] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: [
              ['Producto/Servicio', 'Descripción', 'Monto'],
              ...invoiceDetails.map(item => [
                item.name,
                item.description,
                `$${item.amount}`,
              ]),
              [{ text: 'Total', colSpan: 2 }, {}, `$${totalAmount}`],
            ],
          },
          layout: 'lightHorizontalLines',
        },
        { text: 'Gracias por su preferencia.', margin: [0, 20, 0, 0] },
        // Aquí se agrega el código QR
        { text: 'Código QR para pagar', margin: [0, 20, 0, 10] },
        {
          qr: `Factura: ${invoiceNumber}\nMonto: $${totalAmount}`, // El contenido del código QR
          fit: 100 // Tamaño del QR
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
        },
        total: {
          bold: true,
          fontSize: 16,
        },
      },
    };

    // Crear el documento PDF
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    return pdfDoc;
  }
}
