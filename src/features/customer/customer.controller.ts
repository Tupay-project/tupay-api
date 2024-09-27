import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomerService) {}


  
  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'El cliente ha sido creado.', type: Customer })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.createCustomer(createCustomerDto);
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
