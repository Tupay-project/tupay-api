import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { FundingProvider } from './entities/provider.entity';


@Controller('funding-provider')
export class FundingProviderController {
  constructor(private readonly fundingProviderService: FundingProviderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo proveedor con una PrivateKey y ApiKey generadas automáticamente' })
  @ApiResponse({ status: 201, description: 'Proveedor creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el proveedor' })
  async createProvider(@Body() createProviderDto: CreateProviderDto): Promise<FundingProvider> {
    try {
      const provider = await this.fundingProviderService.createProvider(createProviderDto);
      return provider;
    } catch (error) {
      throw new HttpException('Error al crear el proveedor', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  async getAllProviders(): Promise<FundingProvider[]> {
    return this.fundingProviderService.getAllProviders();
  }
}
