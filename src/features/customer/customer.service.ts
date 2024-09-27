import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const { governmentId } = createCustomerDto;

        // Verificar si el governmentId ya existe
        const existingCustomer = await this.customersRepository.findOne({ where: { governmentId } });
        if (existingCustomer) {
            throw new ConflictException('Government ID already exists');
        }

        const newCustomer = this.customersRepository.create(createCustomerDto);
        return await this.customersRepository.save(newCustomer);
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
