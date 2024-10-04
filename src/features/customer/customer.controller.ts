import { Body, ConflictException, Controller, Get, Param, Post, Put, Req, SetMetadata, UseGuards, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
// import { ApiKeyGuard } from '../funding-provider/guard/api-key.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';

@UseGuards(JwtGuard, RoleGuard)
// @UseGuards(ApiKeyGuard)
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
      const userId = req.user.id; // Obtener el ID del usuario autenticado
      const providerId = createCustomerDto.providerId; // Obtener el ID del proveedor del DTO (si lo incluyes en el DTO)
  
      // Pasar el ID del usuario y del proveedor al servicio
      const customer = await this.customersService.createCustomer(createCustomerDto, userId, providerId); 
  
      return customer;
    } catch (error) {
      console.error('Error creando el cliente:', error);
      throw new ConflictException('Error al crear el cliente');
    }
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un cliente por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Detalles del cliente obtenidos con éxito.', type: Customer })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    try {
      const customer = await this.customersService.getCustomerById(id);
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
      return customer;
    } catch (error) {
      console.error(`Error obteniendo cliente con ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new ConflictException('Error al obtener el cliente');
    }
  }

  @Get()
  @SetMetadata('roles', ['user', 'admin'])
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito.', type: [Customer] })
  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.customersService.getAllCustomers();
    } catch (error) {
      console.error('Error obteniendo todos los clientes:', error);
      throw new ConflictException('Error al obtener la lista de clientes');
    }
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
    try {
      const customer = await this.customersService.updateCustomer(id, updateCustomerDto);
      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
      return customer;
    } catch (error) {
      console.error(`Error actualizando cliente con ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new ConflictException('Error al actualizar el cliente');
    }
  }

 
}
