/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyService } from '../api-key/api-key.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { FundingProvider } from './entities/provider.entity';
import { User } from '../user/entities/user.entity';
import { LoginProviderDto } from './dto/LoginProviderDto';
import { UpdateProviderDto } from './dto/UpdateProviderDto';
import { JwtService } from '@nestjs/jwt';
import { AddFundsDto } from './dto/AddFundsDto';
import { Transaction } from '../manager/entities/transaction.entity';
import { HttpService } from '@nestjs/axios';
import { Customer } from '../customer/entities/customer.entity';
import { InvoiceHistoryDto, TransactionHistoryDto } from './dto/HistoryDto';
import { Invoice } from '../invoice/entities/invoice.entity';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';


@UseGuards(JwtGuard, RoleGuard)  
@Injectable()
export class FundingProviderService {
  constructor(
    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,  

  ) {}

  async createProvider(
    createProviderDto: CreateProviderDto,
    userId: string,
  ): Promise<FundingProvider> {
    // Verificar si ya existe un proveedor con el mismo accountNumber
    const existingProvider = await this.providerRepository.findOne({
      where: { accountNumber: createProviderDto.accountNumber },
    });

    if (existingProvider) {
      throw new HttpException(
        'El número de cuenta ya existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Buscar el usuario que está creando el proveedor
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Generamos las claves PrivateKey y AccessKey
    const privateKey = uuidv4();
    const accessKey = uuidv4();

    // Crear el proveedor y asociarlo al usuario
    const provider = this.providerRepository.create({
      ...createProviderDto,
      privateKey,
      accessKey,
      createdBy: user, // Guardamos la referencia al usuario
    });

    // Guardamos el proveedor en la base de datos
    const savedProvider = await this.providerRepository.save(provider);

    // Excluir las claves de la respuesta
    delete savedProvider.privateKey;
    delete savedProvider.accessKey;

    return savedProvider;
  }
  //

  // async authenticateProvider(
  //   loginProviderDto: LoginProviderDto,
  // ): Promise<{ token: string; provider: FundingProvider }> {
  //   const { accessKey, privateKey } = loginProviderDto;

  //   // Buscar el proveedor en la entidad FundingProvider usando accessKey y privateKey
  //   const provider = await this.providerRepository.findOne({
  //     where: { accessKey, privateKey },
  //   });

  //   if (!provider) {
  //     throw new HttpException(
  //       'Credenciales inválidas',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   // Preparar el payload para el token
  //   const payload = { id: provider.id, name: provider.name };

  //   // Generar el token JWT
  //   const token = this.jwtService.sign(payload);

  //   // Excluir las claves de la respuesta
  //   delete provider.privateKey;
  //   delete provider.accessKey;

  //   // Devolver el token y la información del proveedor
  //   return {
  //     token,
  //     provider,
  //   };
  // }


  async getProviderById(id: string): Promise<FundingProvider> {
    const provider = await this.providerRepository.findOne({ where: { id } });

    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    return provider;
  }

  async getCustomersByProviderId(providerId: string): Promise<Customer[]> {
    // Buscar el usuario que tiene el rol de 'provider' y el ID del proveedor
    const providerUser = await this.userRepository.findOne({
      where: { id: providerId },
      relations: ['roles', 'customer'], // Relación con roles y customer
    });
  
    if (!providerUser) {
      throw new NotFoundException('Proveedor no encontrado');
    }
  
    // Verificar si el usuario tiene el rol de 'provider'
    const isProvider = providerUser.roles.some((role) => role.name === 'provider');
    
    if (!isProvider) {
      throw new NotFoundException('El usuario no tiene el rol de proveedor');
    }
  
    // Retornar los clientes asociados a este proveedor (usuario)
    const customers = providerUser.customer ? [providerUser.customer] : [];
  
    return customers;
  }
  
  async getAllProviders(): Promise<User[]> {
    // Filtrar los usuarios que tienen el rol de 'provider'
    return this.userRepository.find({
      where: {
        roles: { name: 'provider' },  // Filtrar usuarios cuyo rol sea 'provider'
      },
      relations: ['roles'],  // Asegurarnos de cargar los roles junto con los usuarios
    });
  }
  

  //
  async getProviderDetails(accessKey: string, privateKey: string) {
    console.log('AccessKey recibida en el servicio:', accessKey);
    console.log('PrivateKey recibida en el servicio:', privateKey);
    if (!accessKey || !privateKey) {
      throw new HttpException('Access Key or Private Key missing', HttpStatus.BAD_REQUEST);
    }

    // Buscar el proveedor en la base de datos
    const provider = await this.providerRepository.findOne({
      where: { accessKey, privateKey },
    });

    if (!provider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    return provider;
  }

  // async getProviderByKeys(accessKey: string, privateKey: string): Promise<FundingProvider | null> {
  //   console.log('AccessKey recibida en el servicio:', accessKey);
  //   console.log('PrivateKey recibida en el servicio:', privateKey);
  
  //   const provider = await this.providerRepository.findOne({
  //     where: { accessKey, privateKey },
  //   });
  
  //   if (!provider) {
  //     console.log('Proveedor no encontrado en la base de datos con las claves proporcionadas.');
  //     return null;
  //   }
  
  //   // Excluir las claves de la respuesta
  //   delete provider.privateKey;
  //   delete provider.accessKey;
  
  //   return provider;
  // }

  async getProviderByKeys(accessKey: string, privateKey: string): Promise<User | null> {
    console.log('AccessKey recibida en el servicio:', accessKey);
    console.log('PrivateKey recibida en el servicio:', privateKey);
  
    const user = await this.userRepository.findOne({
      where: { accessKey, privateKey },  // Busca en la entidad User
    });
  
    if (!user) {
      console.log('Usuario no encontrado en la base de datos con las claves proporcionadas.');
      return null;
    }
  
    // Excluir las claves de la respuesta
    delete user.privateKey;
    delete user.accessKey;
  
    return user;
  }
  
  
  async updateProviderInfo(
    updateProviderDto: UpdateProviderDto,
    accessKey: string,
    privateKey: string,
  ): Promise<FundingProvider> {
    const provider = await this.getProviderByKeys(accessKey, privateKey);

    // Actualizar los campos proporcionados
    if (updateProviderDto.name) provider.name = updateProviderDto.name;
    if (updateProviderDto.webhookUrl)
      provider.webhookUrl = updateProviderDto.webhookUrl;
    if (updateProviderDto.availableFunds)
      provider.availableFunds = updateProviderDto.availableFunds;

    // Guardar los cambios en la base de datos
    return this.providerRepository.save(provider);
  }

  // requerimientos no funcionales
  async addFunds(accessKey: string, privateKey: string, addFundsDto: AddFundsDto): Promise<string> {
    // Busca el proveedor basado en las claves API (accessKey y privateKey)
    const provider = await this.providerRepository.findOne({ where: { accessKey, privateKey } });
  
    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Crear la transacción en estado 'pending' mientras se procesa externamente
    const transaction = this.transactionRepository.create({
      provider,
      amount: addFundsDto.amount,
      type: 'credit',  // Transacción de crédito (agregar fondos)
      status: 'pending',  // Estado inicial 'pending'
      paymentReference: 'REF-' + Date.now(),  // Generar una referencia de pago única
    });
  
    await this.transactionRepository.save(transaction);
  
    // Aquí llamas a la API externa (o simulada) para obtener el link de pago
    const paymentLink = await this.sendToExternalApi(transaction);
  
    // Retorna el link de pago para que el controlador lo incluya en la respuesta
    return paymentLink;
  }
  
  
  
 
  async sendToExternalApi(transaction: Transaction): Promise<string> {
    // Simulación de una respuesta exitosa de la API externa de prueba
    const paymentLink = `https://payment-provider.com/pay?transaction=${transaction.paymentReference}`;
    
    // Simula un pequeño retraso como si fuera una llamada real a la API externa
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    return paymentLink;  // Devuelve un link simulado de pago
  }
  
  
  async findOne(providerId: string): Promise<FundingProvider> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return provider;
  }

  // Método para actualizar los datos del proveedor
  async update(providerId: string, updateData: Partial<FundingProvider>): Promise<FundingProvider> {
    await this.providerRepository.update(providerId, updateData);
    const updatedProvider = await this.findOne(providerId);
    return updatedProvider;
  }
  

  // balance
  async getProviderBalance(providerId: string): Promise<{ providerId: string; balance: number }> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return {
      providerId: provider.id,
      balance: provider.availableFunds,
    };
  }
  async getcustomerProviderId(providerId:string):Promise<Customer[]>{
    const provider  = await this.providerRepository.findOne({
      where:{id:providerId},
      relations:['customers']
    })
    if (!provider){
      throw new NotFoundException('Proveedor no encontrado');
    }

    return provider.customers;

  }

  async getTransactionsByProviderId(providerId: string): Promise<Transaction[]> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
      relations: ['transactions'],  
    });
  
    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }
  
    return provider.transactions;
  }

  async getTransactionHistory(
    providerId: string,
    filters: TransactionHistoryDto,
  ): Promise<Transaction[]> {
    const query = this.transactionRepository.createQueryBuilder('transaction')
      .where('transaction.providerId = :providerId', { providerId });
  
    if (filters.startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate: filters.startDate });
    }
  
    if (filters.endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate: filters.endDate });
    }
  
    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }
  
    if (filters.status) {
      query.andWhere('transaction.status = :status', { status: filters.status });
    }
  
    const transactions = await query.getMany();
    return transactions;
  }

  // 
  async getInvoiceHistory(
    providerId: string,
    filters: InvoiceHistoryDto,
  ): Promise<Invoice[]> {
    try {
      const query = this.invoiceRepository.createQueryBuilder('invoice')
        .where('invoice.providerId = :providerId', { providerId });
  
      if (filters.startDate) {
        query.andWhere('invoice.createdAt >= :startDate', { startDate: filters.startDate });
      }
  
      if (filters.endDate) {
        query.andWhere('invoice.createdAt <= :endDate', { endDate: filters.endDate });
      }
  
      if (filters.status) {
        query.andWhere('invoice.status = :status', { status: filters.status });
      }
  
      if (filters.numberAgreement) {
        query.andWhere('invoice.numberAgreement LIKE :numberAgreement', { numberAgreement: `%${filters.numberAgreement}%` });
      }
  
      const invoices = await query.getMany();
      return invoices;
    } catch (error) {
      console.error('Error al obtener el historial de facturas:', error.message);
      throw new HttpException(
        `Error interno al obtener el historial de facturas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  
  

}
