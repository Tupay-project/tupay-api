import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtGuard } from '../auth/auth/auth.guard';

@ApiTags('customers')
@Controller('customer')
@UseGuards(JwtGuard)
export class CustomerController {
  constructor(private readonly customersService: CustomerService) {}


  @Post('create')
  @ApiOperation({ summary: 'Crear un cliente asociado a un proveedor' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el cliente' })
  // async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
  //   try {
  //     const customer = await this.customersService.createCustomer(createCustomerDto);
  //     return customer;
  //   } catch (error) {
  //     throw new HttpException('Error al crear el cliente', HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un cliente por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Detalles del cliente obtenidos con éxito.', type: Customer })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customersService.getCustomerById(id);
  }

  @Get()
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
