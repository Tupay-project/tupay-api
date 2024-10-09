import { Body, ClassSerializerInterceptor, ConflictException, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from '../api-key/guard/api-key.guard';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@UseGuards(JwtGuard, RoleGuard)
@UseGuards(ApiKeyGuard)
@Controller('customer')
@UseInterceptors(ClassSerializerInterceptor)  // Habilitar la transformación de serialización
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un cliente asociado a un proveedor' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el cliente' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto, @Req() req: any): Promise<Partial<Customer>> { 
      try {
          const user = req.user;  // Obtener el usuario autenticado
          const customer = await this.customerService.createCustomer(createCustomerDto, user);  
          return customer;  
      } catch (error) {
        console.log(error);
        throw new ConflictException('Error al crear el cliente');
      }
  }
}
