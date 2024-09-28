import { Args, Query, Resolver } from '@nestjs/graphql';
import { ManagerService } from './manager.service';
import { Manager } from './entities/manager.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Customer } from '../customer/entities/customer.entity';
import { FundingProvider } from '../funding-provider/entities/provider.entity';
import { Payment } from './entities/payment.entity';
import { Transaction } from './entities/transaction.entity';

@Resolver(() => Manager)
export class ManagerResolver {
  constructor(private readonly managerService: ManagerService) {}

  // Resolver para obtener todos los proveedores de fondos
  @Query(() => [FundingProvider], { name: 'getAllFundingProviders' })
  async getAllFundingProviders() {
    return this.managerService.getAllFundingProviders();
  }

  // Resolver para obtener un proveedor de fondos por ID
  @Query(() => FundingProvider, { name: 'getFundingProviderById' })
  async getFundingProviderById(@Args('id') id: string) {
    return this.managerService.getFundingProviderById(id);
  }

  // Resolver para obtener todos los clientes
  @Query(() => [Customer], { name: 'getAllCustomers' })
  async getAllCustomers() {
    return this.managerService.getAllCustomers();
  }

  // Resolver para obtener un cliente por ID
  @Query(() => Customer, { name: 'getCustomerById' })
  async getCustomerById(@Args('id') id: string) {
    return this.managerService.getCustomerById(id);
  }

  // Resolver para obtener todas las facturas
  @Query(() => [Invoice], { name: 'getAllInvoices' })
  async getAllInvoices() {
    return this.managerService.getAllInvoices();
  }

  // Resolver para obtener una factura por ID
  @Query(() => Invoice, { name: 'getInvoiceById' })
  async getInvoiceById(@Args('id') id: string) {
    return this.managerService.getInvoiceById(id);
  }

  // Resolver para obtener todos los pagos
  @Query(() => [Payment], { name: 'getAllPayments' })
  async getAllPayments() {
    return this.managerService.getAllPayments();
  }

  // Resolver para obtener un pago por ID
  @Query(() => Payment, { name: 'getPaymentById' })
  async getPaymentById(@Args('id') id: string) {
    return this.managerService.getPaymentById(id);
  }

  // Resolver para obtener todas las transacciones
  @Query(() => [Transaction], { name: 'getAllTransactions' })
  async getAllTransactions() {
    return this.managerService.getAllTransactions();
  }

  // Resolver para obtener una transacción por ID
  @Query(() => Transaction, { name: 'getTransactionById' })
  async getTransactionById(@Args('id') id: string) {
    return this.managerService.getTransactionById(id);
  }

}
