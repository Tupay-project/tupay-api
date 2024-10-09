import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentProvider } from "../provider/entities/provider.entity";
import { User } from "../user/entities/user.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Customer } from "./entities/customer.entity";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
        @InjectRepository(PaymentProvider)
        private readonly providerRepository: Repository<PaymentProvider>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createCustomer(createCustomerDto: CreateCustomerDto, user: User): Promise<Partial<Customer>> {
        // Buscar el usuario autenticado con sus roles
        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['roles'],
        });

        if (!fullUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Verificar si el usuario tiene el rol de 'provider'
        const isProvider = fullUser.roles.some(role => role.name === 'provider');
        if (!isProvider) {
            throw new ConflictException('El usuario no tiene el rol de proveedor');
        }

        // Buscar el PaymentProvider asociado al usuario autenticado
        const provider = await this.providerRepository.findOne({
            where: { createdBy: fullUser }, // Buscar por el campo createdBy en PaymentProvider
        });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado para este usuario');
        }

        // Validar si el usuario/proveedor tiene permisos para crear un cliente
        const hasPermission = fullUser.roles.some(role => role.name === 'can_create_customer');
        if (!hasPermission) {
            throw new ConflictException('El proveedor no tiene permisos para crear clientes');
        }

        // Crear el cliente con el proveedor asociado
        const customer = this.customersRepository.create({
            ...createCustomerDto,
            provider: provider, // Asociar el PaymentProvider completo
        });

        // Guardar el cliente en la base de datos
        const savedCustomer = await this.customersRepository.save(customer);

        // Retornar solo los datos esenciales
        return {
            id: savedCustomer.id,
            name: savedCustomer.name,
            email: savedCustomer.email,
            phoneNumber: savedCustomer.phoneNumber,
        };
    }
}
