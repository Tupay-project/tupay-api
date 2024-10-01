import { Controller, Post, Headers,Body, Get, HttpException, HttpStatus, UseGuards, Req, Patch, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { FundingProvider } from './entities/provider.entity';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { ApiKeyGuard } from './guard/api-key.guard';
import { LoginProviderDto } from './dto/LoginProviderDto';
import { UpdateProviderDto } from './dto/UpdateProviderDto';
import { AddFundsDto } from './dto/AddFundsDto';
import { InvoiceHistoryDto, TransactionHistoryDto } from './dto/HistoryDto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.docorator';
import { JwtGuard } from '../auth/guards/auth.guard';



@UseGuards(JwtGuard, RoleGuard)  
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

  @Roles('provider') 
  @Get('me')
  @ApiOperation({ summary: 'Obtener detalles de la cuenta del proveedor' })
  async getProviderDetails(@Req() req: any) {
    try {
      const { accessKey, privateKey } = req.headers;
      console.log('AccessKey:', accessKey);
      console.log('PrivateKey:', privateKey);
  
      if (!accessKey || !privateKey) {
        throw new HttpException('Access Key or Private Key missing', HttpStatus.BAD_REQUEST);
      }
  
      const provider = await this.fundingProviderService.getProviderDetails(accessKey, privateKey);
  
      if (!provider) {
        throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
      }
  
      return provider;
    } catch (error) {
      console.error('Error in getProviderDetails:', error.message);
      throw new HttpException('Internal server error: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Patch('update')
  @ApiOperation({ summary: 'Actualizar la información del proveedor' })
  async updateProviderInfo(@Body() updateProviderDto: UpdateProviderDto, @Req() req: any) {
    const { accessKey, privateKey } = req.headers;
    const updatedProvider = await this.fundingProviderService.updateProviderInfo(updateProviderDto, accessKey, privateKey);
    return updatedProvider;
  }

  //    privateKey = dd5421d1-5a6f-485a-86f8-f489d3e71ee3
//    accessKey = dd3e8dc3c3-66c1-4834-982e-584aa0e64416

// "privateKey": "dd5421d1-5a6f-485a-86f8-f489d3e71ee3",
// "accessKey": "3e8dc3c3-66c1-4834-982e-584aa0e64416",
// token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzZjJiN2U2LTJiZTEtNDRiZS1iNjUwLWIxODM2Mzk3YzIxMiIsIm5hbWUiOiJmbG93ZXIiLCJpYXQiOjE3Mjc4MTA1NDcsImV4cCI6MTcyNzg5Njk0N30.lq4FlT1wsnFPkIj8WADbGkTFHfxCG8Gni9XCxBgba84


  @Get('all')
  @UseGuards(ApiKeyGuard)  
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


@Get(':providerId/balance')
@ApiOperation({ summary: 'Obtener el balance de un proveedor' })
@ApiParam({ name: 'providerId', description: 'ID del proveedor' })
@ApiResponse({ status: 200, description: 'Balance obtenido con éxito' })
@ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
async getProviderBalance(@Param('providerId') providerId: string) {
  const balance = await this.fundingProviderService.getProviderBalance(providerId);
  return balance;
}


@Get(':providerId/customers')
@ApiOperation({ summary: 'Obtener los customers asociados a un provider' })
@ApiParam({ name: 'providerId', description: 'ID del provider' })
async getCustomersForProvider(@Param('providerId') providerId: string) {
  const customers = await this.fundingProviderService.getcustomerProviderId(providerId);
  return customers;
}


@Get(':providerId/transactions')
@ApiOperation({ summary: 'Obtener las transacciones asociadas a un provider' })
@ApiParam({ name: 'providerId', description: 'ID del provider' })
async getTransactionsForProvider(@Param('providerId') providerId: string) {
  const transactions = await this.fundingProviderService.getTransactionsByProviderId(providerId);
  return transactions;
}

@Get(':providerId/transaction-history')
@ApiOperation({ summary: 'Obtener el historial de transacciones del provider con filtros opcionales' })
async getTransactionHistory(
  @Param('providerId') providerId: string,
  @Query() filters: TransactionHistoryDto,
) {
  const transactions = await this.fundingProviderService.getTransactionHistory(providerId, filters);
  return transactions;
}



@Get(':providerId/invoice-history')
@ApiOperation({ summary: 'Obtener el historial de facturas del provider con filtros opcionales' })
async getInvoiceHistory(
  @Param('providerId') providerId: string,
  @Query() filters: InvoiceHistoryDto,
) {
  try {
    const invoices = await this.fundingProviderService.getInvoiceHistory(providerId, filters);
    return invoices;
  } catch (error) {
    console.error('Error en el controlador al obtener historial de facturas:', error.message);
    throw new HttpException(
      `Error al obtener historial de facturas: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}






}
