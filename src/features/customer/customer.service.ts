/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FundingProvider } from '../funding-provider/entities/provider.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,


    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
    ) { }
    async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Omit<Customer, 'provider'>> {
        const provider = await this.providerRepository.findOne({ where: { id: createCustomerDto.providerId } });
        
        if (!provider) {
          throw new Error('Provider not found');
        }
      
        // Crear el cliente con el proveedor
        const customer = this.customersRepository.create({
          ...createCustomerDto,
          provider, 
        });
      
        // Guardar el cliente en la base de datos
        const savedCustomer = await this.customersRepository.save(customer);
      
        // Eliminar el campo provider de la respuesta antes de devolverla
        const { provider: _, ...customerWithoutProvider } = savedCustomer;
      
        return customerWithoutProvider;
      }
      
      

    // Método para obtener un cliente por ID
    async getCustomerById(id: string): Promise<Customer> {
        const customer = await this.customersRepository.findOne({ where: { id } });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    // Método para obtener todos los clientes
    async getAllCustomers(): Promise<Customer[]> {
        return await this.customersRepository.find();
    }

    // Método para actualizar un cliente
    async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.getCustomerById(id);
        Object.assign(customer, updateCustomerDto);
        return await this.customersRepository.save(customer);
    }

    // Método para eliminar un cliente
    async deleteCustomer(id: string): Promise<void> {
        const customer = await this.getCustomerById(id);
        await this.customersRepository.remove(customer);
    }
}
