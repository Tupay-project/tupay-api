import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FundingProviderService } from './funding-provider.service';
import { CreateProviderDto } from './dto/CreateProviderDto';
import { ApiKeyGuard } from './guard/api-key.guard';
import { InvoiceHistoryDto, TransactionHistoryDto } from './dto/HistoryDto';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtGuard } from '../auth/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { Customer } from '../customer/entities/customer.entity';

// @UseGuards(JwtGuard, RoleGuard)
// @UseGuards(ApiKeyGuard)
@Controller('funding-provider')
export class FundingProviderController {
  constructor(
    private readonly fundingProviderService: FundingProviderService,
  ) {}

  @ApiOperation({
    summary:
      'Crear un nuevo proveedor con una PrivateKey y ApiKey generadas automáticamente',
  })
  @ApiResponse({ status: 201, description: 'Proveedor creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el proveedor' })
  @Post('create')
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user.id; // Obtener el ID del usuario conectado desde la request
      const provider = await this.fundingProviderService.createProvider(
        createProviderDto,
        userId,
      ); // Pasar el ID del usuario al servicio
      return provider;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw new HttpException(
        `Error al crear el proveedor: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get(':providerId/customers')
@ApiOperation({ summary: 'Obtener los clientes asociados a un proveedor' })
@ApiParam({ name: 'providerId', description: 'ID del proveedor' })
@ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito.' })
@ApiResponse({ status: 404, description: 'Proveedor no encontrado.' })
async getCustomersByProviderId(@Param('providerId') providerId: string): Promise<Customer[]> {
  return this.fundingProviderService.getCustomersByProviderId(providerId);
}


  //

  // @Patch('update')
  // @ApiOperation({ summary: 'Actualizar la información del proveedor' })
  // async updateProviderInfo(
  //   @Body() updateProviderDto: UpdateProviderDto,
  //   @Req() req: any,
  // ) {
  //   const { accessKey, privateKey } = req.headers;
  //   const updatedProvider =
  //     await this.fundingProviderService.updateProviderInfo(
  //       updateProviderDto,
  //       accessKey,
  //       privateKey,
  //     );
  //   return updatedProvider;
  // }

  @Get('all')
  // @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  async getAllProviders(): Promise<User[]> {
    return this.fundingProviderService.getAllProviders();
  }
  

  // @Post('add-funds')
  // @UseGuards(ApiKeyGuard)
  // async addFunds(
  //   @Headers('accesskey') accessKey: string,
  //   @Headers('privatekey') privateKey: string,
  //   @Body() addFundsDto: AddFundsDto,
  // ): Promise<{ message: string; paymentLink?: string }> {
  //   try {
  //     console.log('AccessKey en controlador:', accessKey);
  //     console.log('PrivateKey en controlador:', privateKey);

  //     // Llamada al servicio para agregar fondos y obtener el link de pago
  //     const paymentLink = await this.fundingProviderService.addFunds(
  //       accessKey,
  //       privateKey,
  //       addFundsDto,
  //     );

  //     // Retorna el mensaje con el link de pago
  //     return {
  //       message:
  //         'Transacción creada exitosamente. Completa el pago en el siguiente enlace.',
  //       paymentLink,
  //     };
  //   } catch (error) {
  //     console.error('Error al agregar fondos:', error);
  //     throw new HttpException(
  //       `Error al agregar fondos: ${error.message}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  @Get(':providerId/balance')
  @ApiOperation({ summary: 'Obtener el balance de un proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Balance obtenido con éxito' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async getProviderBalance(@Param('providerId') providerId: string) {
    const balance =
      await this.fundingProviderService.getProviderBalance(providerId);
    return balance;
  }

  // @Get(':providerId/customers')
  // @ApiOperation({ summary: 'Obtener los customers asociados a un provider' })
  // @ApiParam({ name: 'providerId', description: 'ID del provider' })
  // async getCustomersForProvider(@Param('providerId') providerId: string) {
  //   const customers =
  //     await this.fundingProviderService.getcustomerProviderId(providerId);
  //   return customers;
  // }

  @Get(':providerId/transactions')
  @ApiOperation({
    summary: 'Obtener las transacciones asociadas a un provider',
  })
  @ApiParam({ name: 'providerId', description: 'ID del provider' })
  async getTransactionsForProvider(@Param('providerId') providerId: string) {
    const transactions =
      await this.fundingProviderService.getTransactionsByProviderId(providerId);
    return transactions;
  }

  @Get(':providerId/transaction-history')
  @ApiOperation({
    summary:
      'Obtener el historial de transacciones del provider con filtros opcionales',
  })
  async getTransactionHistory(
    @Param('providerId') providerId: string,
    @Query() filters: TransactionHistoryDto,
  ) {
    const transactions =
      await this.fundingProviderService.getTransactionHistory(
        providerId,
        filters,
      );
    return transactions;
  }

  @Get(':providerId/invoice-history')
  @ApiOperation({
    summary:
      'Obtener el historial de facturas del provider con filtros opcionales',
  })
  async getInvoiceHistory(
    @Param('providerId') providerId: string,
    @Query() filters: InvoiceHistoryDto,
  ) {
    try {
      const invoices = await this.fundingProviderService.getInvoiceHistory(
        providerId,
        filters,
      );
      return invoices;
    } catch (error) {
      console.error(
        'Error en el controlador al obtener historial de facturas:',
        error.message,
      );
      throw new HttpException(
        `Error al obtener historial de facturas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
