import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { Repository } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {

  constructor(
    @InjectRepository(ApiKey)
    private readonly clientKeyRepository: Repository<ApiKey>,
  ) {}

  // generar key
  async generatedKey(dto:CreateApiKeyDto):Promise<ApiKey>{

    const accessKey = uuidv4()
    const privateKey  = uuidv4()

    const clientKey = this.clientKeyRepository.create({
      clientName: dto.clientName,
      accessKey,
      privateKey,
    })

    return this.clientKeyRepository.save(clientKey);

  }
  async validateKeys(accessKey: string, privateKey: string): Promise<boolean> {
    const clientKey = await this.clientKeyRepository.findOne({ where: { accessKey, privateKey } });
    return !!clientKey; 
  }

  async validateAccessKey(accessKey: string): Promise<boolean> {
    console.log('Validating AccessKey:', accessKey); // Log para ver la clave que se está validando
    const client = await this.clientKeyRepository.findOne({ where: { accessKey } });

    if (!client) {
      console.error('AccessKey not found:', accessKey); // Log si no se encuentra la clave
    } else {
      console.log('AccessKey found:', client); // Log si se encuentra la clave
    }

    return !!client; // Retorna true si la AccessKey es válida
  }
  async getAllApiKeys(): Promise<ApiKey[]> {
    return this.clientKeyRepository.find();
  }

  

}
