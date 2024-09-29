/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class FundingProviderService {
  constructor(
    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
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

  async authenticateProvider(
    loginProviderDto: LoginProviderDto,
  ): Promise<{ token: string; provider: FundingProvider }> {
    const { accessKey, privateKey } = loginProviderDto;

    // Buscar el proveedor en la entidad FundingProvider usando accessKey y privateKey
    const provider = await this.providerRepository.findOne({
      where: { accessKey, privateKey },
    });

    if (!provider) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Preparar el payload para el token
    const payload = { id: provider.id, name: provider.name };

    // Generar el token JWT
    const token = this.jwtService.sign(payload);

    // Excluir las claves de la respuesta
    delete provider.privateKey;
    delete provider.accessKey;

    // Devolver el token y la información del proveedor
    return {
      token,
      provider,
    };
  }

  async getProviderById(id: string): Promise<FundingProvider> {
    const provider = await this.providerRepository.findOne({ where: { id } });

    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    return provider;
  }

  async getAllProviders(): Promise<FundingProvider[]> {
    return this.providerRepository.find();
  }

  //

  async getProviderByKeys(
    accessKey: string,
    privateKey: string,
  ): Promise<FundingProvider> {
    const provider = await this.providerRepository.findOne({
      where: { accessKey, privateKey },
    });
    if (!provider) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    delete provider.privateKey;
    delete provider.accessKey;
    return provider;
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

  //
}
