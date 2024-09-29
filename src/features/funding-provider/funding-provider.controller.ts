import { Controller, Post, Body, Get, HttpException, HttpStatus, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { FundingProvider } from './entities/provider.entity';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { ApiKeyGuard } from './guard/api-key.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtGuard } from '../auth/guards/auth.guard';


@Controller('funding-provider')
@UseGuards(JwtGuard, RoleGuard)  
export class FundingProviderController {
  constructor(private readonly fundingProviderService: FundingProviderService) {}


  @ApiOperation({ summary: 'Crear un nuevo proveedor con una PrivateKey y ApiKey generadas automáticamente' })
  @ApiResponse({ status: 201, description: 'Proveedor creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el proveedor' })
  @Post('create')
  @SetMetadata('roles', ['admin']) 
  async createProvider(@Body() createProviderDto: CreateProviderDto, @Req() req: any) {
    try {
      const userId = req.user.id;  // Obtener el ID del usuario conectado desde la request
      const provider = await this.fundingProviderService.createProvider(createProviderDto, userId);  // Pasar el ID del usuario al servicio
      return provider;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw new HttpException(`Error al crear el proveedor: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  async getAllProviders(): Promise<FundingProvider[]> {
    return this.fundingProviderService.getAllProviders();
  }

  @Get('info')
  @UseGuards(ApiKeyGuard) 
  getProviderInfo() {
    // Información del proveedor solo accesible si las claves API son válidas
    return { message: 'Access granted to provider info' };
  }


}
