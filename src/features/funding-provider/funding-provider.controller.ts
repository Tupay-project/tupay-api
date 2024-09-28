import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { FundingProvider } from './entities/provider.entity';
import { CreateProviderDto } from './dto/CreateProviderDto';


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
      console.error('Error en el controlador al crear el proveedor:', error);  // Registrar el error
      throw new HttpException(`Error al crear el proveedor: ${error.message}`, HttpStatus.BAD_REQUEST);  // Lanzar una excepción con detalles
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  async getAllProviders(): Promise<FundingProvider[]> {
    return this.fundingProviderService.getAllProviders();
  }
}
