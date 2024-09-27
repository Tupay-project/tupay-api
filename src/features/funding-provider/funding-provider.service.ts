import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyService } from '../api-key/api-key.service';
import { v4 as uuidv4 } from 'uuid';  // Importamos uuid para generar la PrivateKey
import { CreateProviderDto } from './dto/CreateProviderDto';
import { FundingProvider } from './entities/provider.entity';

@Injectable()
export class FundingProviderService {
  constructor(
    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,
    private readonly apiKeyService: ApiKeyService, 
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<FundingProvider> {
    // Generamos una PrivateKey al crear un proveedor
    const privateKey = uuidv4();

    // Creamos el proveedor con la PrivateKey
    const provider = this.providerRepository.create({
      ...createProviderDto,
      privateKey,  // Asignamos la PrivateKey generada
    });

    // Guardamos el proveedor en la base de datos
    const savedProvider = await this.providerRepository.save(provider);

    // Generamos la ApiKey para el proveedor utilizando el ApiKeyService
    const apiKeyDto = {
      clientName: savedProvider.name,  // Aseguramos que name existe en savedProvider
    };

    await this.apiKeyService.generatedKey(apiKeyDto);  // Generamos la AccessKey y PrivateKey

    return savedProvider;
  }

    // Método para obtener todos los proveedores (opcional)
    async getAllProviders(): Promise<FundingProvider[]> {
        return this.providerRepository.find();
      }
}
