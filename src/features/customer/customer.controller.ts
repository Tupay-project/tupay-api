import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiKeyGuard } from '../funding-provider/guard/api-key.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';


@UseGuards(JwtGuard, RoleGuard)
@UseGuards(ApiKeyGuard)
@ApiTags('customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomerService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un cliente asociado a un proveedor' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el cliente' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto, @Req() req: any): Promise<Customer> {
      try {
          const userId = req.user.id;  // Obtener el ID del usuario autenticado
          const customer = await this.customersService.createCustomer(createCustomerDto, userId);  // Pasar el ID del usuario al servicio
          return customer;
      } catch (error) {
        console.log(error)
          throw new ConflictException('Error al crear el cliente');
      }
  }
  
  

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un cliente por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Detalles del cliente obtenidos con éxito.', type: Customer })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customersService.getCustomerById(id);
  }


  @Get()
  @SetMetadata('roles', ['user', 'admin']) 
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito.', type: [Customer] })
  async getAllCustomers(): Promise<Customer[]> {
    return this.customersService.getAllCustomers();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiParam({ name: 'id', type: String, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado con éxito.', type: Customer })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', type: String, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.customersService.deleteCustomer(id);
  }
}
