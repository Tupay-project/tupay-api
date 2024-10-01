import { Controller, Post, Headers,Body, Get, HttpException, HttpStatus, UseGuards, Req, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { FundingProvider } from './entities/provider.entity';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { ApiKeyGuard } from './guard/api-key.guard';
import { LoginProviderDto } from './dto/LoginProviderDto';
import { UpdateProviderDto } from './dto/UpdateProviderDto';
import { AddFundsDto } from './dto/AddFundsDto';


@Controller('funding-provider')

export class FundingProviderController {
  constructor(
    private readonly fundingProviderService: FundingProviderService,
  ) {}



  @ApiOperation({ summary: 'Crear un nuevo proveedor con una PrivateKey y ApiKey generadas automáticamente' })
  @ApiResponse({ status: 201, description: 'Proveedor creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el proveedor' })
  @Post('create')
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

  // 

  
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión en el dashboard usando AccessKey y PrivateKey' })
  @ApiResponse({ status: 200, description: 'Proveedor autenticado con éxito' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async loginProvider(@Body() loginProviderDto: LoginProviderDto) {
    try {
      const provider = await this.fundingProviderService.authenticateProvider(loginProviderDto);  // Llamar al método authenticateProvider
      return {
        message: 'Autenticado con éxito',
        provider,  // Devuelve los detalles del proveedor sin las keys
      };
    } catch (error) {
      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener detalles de la cuenta del proveedor' })
  async getProviderDetails(@Req() req: any) {
    const { accessKey, privateKey } = req.headers;
    const provider = await this.fundingProviderService.getProviderByKeys(accessKey, privateKey);
    return provider;
  }

  @Patch('update')
  @ApiOperation({ summary: 'Actualizar la información del proveedor' })
  async updateProviderInfo(@Body() updateProviderDto: UpdateProviderDto, @Req() req: any) {
    const { accessKey, privateKey } = req.headers;
    const updatedProvider = await this.fundingProviderService.updateProviderInfo(updateProviderDto, accessKey, privateKey);
    return updatedProvider;
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


  // @Post('add-funds')
  // @UseGuards(ApiKeyGuard)  // Aplica el ApiKeyGuard a esta ruta
  // async addFunds(
  //   @Headers('accesskey') accessKey: string,
  //   @Headers('privatekey') privateKey: string,
  //   @Body() addFundsDto: AddFundsDto
  // ): Promise<{ message: string }> {
  //   try {
  //     console.log('AccessKey en controlador:', accessKey);
  //     console.log('PrivateKey en controlador:', privateKey);

  //     await this.fundingProviderService.addFunds(accessKey, privateKey, addFundsDto);
  //     return { message: 'Fondos agregados exitosamente' };
  //   } catch (error) {
  //     console.error('Error al agregar fondos:', error);
  //     throw new HttpException(`Error al agregar fondos: ${error.message}`, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Post('add-funds')
@UseGuards(ApiKeyGuard)  // Aplica el ApiKeyGuard a esta ruta
async addFunds(
  @Headers('accesskey') accessKey: string,
  @Headers('privatekey') privateKey: string,
  @Body() addFundsDto: AddFundsDto
): Promise<{ message: string; paymentLink?: string }> {
  try {
    console.log('AccessKey en controlador:', accessKey);
    console.log('PrivateKey en controlador:', privateKey);

    // Llamada al servicio para agregar fondos y obtener el link de pago
    const paymentLink = await this.fundingProviderService.addFunds(accessKey, privateKey, addFundsDto);
    
    // Retorna el mensaje con el link de pago
    return {
      message: 'Transacción creada exitosamente. Completa el pago en el siguiente enlace.',
      paymentLink
    };
  } catch (error) {
    console.error('Error al agregar fondos:', error);
    throw new HttpException(`Error al agregar fondos: ${error.message}`, HttpStatus.BAD_REQUEST);
  }
}



}
