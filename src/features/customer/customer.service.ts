/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '../user/entities/user.entity';
import { FundingProvider } from '../funding-provider/entities/provider.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
  ) {}

  // Método para crear un cliente
  async createCustomer(createCustomerDto: CreateCustomerDto, userId: string, providerId: string): Promise<Customer> {
    try {
      // Buscar el usuario que está creando el cliente
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
  
      // Buscar el proveedor asociado al ID proporcionado
      const provider = await this.providerRepository.findOne({
        where: { id: providerId },
      });
  
      if (!provider) {
        throw new NotFoundException('Proveedor no encontrado');
      }
  
      // Crear el cliente con el proveedor adecuado y el usuario
      const customer = this.customersRepository.create({
        ...createCustomerDto,
        provider,  // Asignamos el provider correcto
        user,      // Asignamos el usuario que creó el cliente
      });
  
      // Guardar el cliente en la base de datos
      const savedCustomer = await this.customersRepository.save(customer);
  
      return savedCustomer; // Devolver el cliente completo, incluyendo provider y user
    } catch (error) {
      console.error('Error creando el cliente:', error);
      throw error instanceof NotFoundException || error instanceof ConflictException
        ? error
        : new ConflictException('Error al crear el cliente');
    }
  }
  
  
  

  // Método para obtener un cliente por ID
  async getCustomerById(id: string): Promise<Customer> {
    try {
      const customer = await this.customersRepository.findOne({ where: { id } });
      if (!customer) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }
      return customer;
    } catch (error) {
      console.error(`Error obteniendo el cliente con ID ${id}:`, error);
      throw error instanceof NotFoundException
        ? error
        : new ConflictException('Error al obtener el cliente');
    }
  }

  // Método para obtener todos los clientes
  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.customersRepository.find();
    } catch (error) {
      console.error('Error obteniendo todos los clientes:', error);
      throw new ConflictException('Error al obtener la lista de clientes');
    }
  }

  // Método para actualizar un cliente
  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.getCustomerById(id);
      Object.assign(customer, updateCustomerDto);
      return await this.customersRepository.save(customer);
    } catch (error) {
      console.error(`Error actualizando el cliente con ID ${id}:`, error);
      throw error instanceof NotFoundException
        ? error
        : new ConflictException('Error al actualizar el cliente');
    }
  }


}
