/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FundingProvider } from '../funding-provider/entities/provider.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,

        @InjectRepository(User) // Inyectamos el repositorio de User
        private readonly userRepository: Repository<User>,


    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
    ) { }

    async createCustomer(createCustomerDto: CreateCustomerDto, userId: string): Promise<Omit<Customer, 'user'>> {
        // Buscar el usuario (provider) que está creando el cliente
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
    
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
    
        // Verificar si el usuario tiene el rol de 'provider'
        const isProvider = user.roles.some(role => role.name === 'provider');
        if (!isProvider) {
            throw new ConflictException('El usuario no tiene el rol de proveedor');
        }
    
        // Crear el cliente con el usuario que lo creó (sin buscar un "provider" adicional)
        const customer = this.customersRepository.create({
            ...createCustomerDto,
            user,  // Asociamos el user que creó el customer
        });
    
        // Guardar el cliente en la base de datos
        const savedCustomer = await this.customersRepository.save(customer);
    
        // Excluir el campo user de la respuesta antes de devolverla
        const { user: _, ...customerWithoutUser } = savedCustomer;
    
        return customerWithoutUser;
    }
    
      
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
