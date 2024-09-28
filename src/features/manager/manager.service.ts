import { Injectable } from '@nestjs/common';
import { FundingProviderService } from '../funding-provider/funding-provider.service';
import { CustomerService } from '../customer/customer.service';
import { InvoiceService } from '../invoice/invoice.service';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from './services/transation.service';

@Injectable()
export class ManagerService {
  constructor(
    private readonly fundingProviderService: FundingProviderService,
    private readonly customerService: CustomerService,
    private readonly invoiceService: InvoiceService,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
  ) {}

  // Método para obtener todos los proveedores de fondos
  async getAllFundingProviders() {
    return await this.fundingProviderService.getAllProviders();
  }

  // Método para obtener un proveedor de fondos por ID
  async getFundingProviderById(id: string) {
    return await this.fundingProviderService.getProviderById(id);
  }

  // Método para obtener todos los clientes
  async getAllCustomers() {
    return await this.customerService.getAllCustomers();
  }

  // Método para obtener un cliente por ID
  async getCustomerById(id: string) {
    return await this.customerService.getCustomerById(id);
  }

  // Método para obtener todas las facturas
  async getAllInvoices() {
    return await this.invoiceService.findInvoiceAll();
  }

  // Método para obtener una factura por ID
  async getInvoiceById(id: string) {
    return await this.invoiceService.findInvoiceById(id);
  }

  // Método para obtener todos los pagos
  async getAllPayments() {
    return await this.paymentService.getAllPayments();
  }

  // Método para obtener un pago por ID
  async getPaymentById(id: string) {
    return await this.paymentService.getPaymentById(id);
  }

  // Método para obtener todas las transacciones
  async getAllTransactions() {
    return await this.transactionService.findAllTransactions();
  }

  // Método para obtener una transacción por ID
  async getTransactionById(id: string) {
    return await this.transactionService.findTransactionById(id);
  }
}
