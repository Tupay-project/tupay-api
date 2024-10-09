import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { SeedEntity } from './entitie/seed-entity';

@Controller('seed')
@ApiTags('Seed') 
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('run')
  @ApiOperation({ summary: 'Generar registros de seed en la base de datos' }) // Descripción de la operación
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'Cantidad de registros a generar',
          example: 50,
        },
      },
    },
  }) // Descripción del cuerpo de la solicitud
  @ApiResponse({ status: 201, description: 'Seeding de registros completado con éxito' })
  @ApiResponse({ status: 500, description: 'Error al ejecutar el seed' })
  async runSeed(@Body('quantity') quantity: number) {
    try {
      await this.seedService.runSeed(quantity);
      return { message: `Seeding ${quantity} records complete!` };
    } catch (error) {
      console.error(error); // Imprime el error en la consola para más detalles
      throw new HttpException('Error al ejecutar el seed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Obtener todos los registros
  @Get()
  async getAllSeeds() {
    return await this.seedService.findAll();
  }

  // Obtener un registro por ID
  @Get(':id')
  async getSeedById(@Param('id') id: string) {
    return await this.seedService.findById(id);
  }

  // Filtrar registros por rol de usuario
  @Get('filter/role')
  async getSeedsByUserRole(@Query('role') role: string) {
    return await this.seedService.findByUserRole(role);
  }



  // Actualizar un registro por ID
  @Put(':id')
  async updateSeed(@Param('id') id: string, @Body() updateData: Partial<SeedEntity>) {
    return await this.seedService.updateSeed(id, updateData);
  }

  // Eliminar un registro por ID
  @Delete(':id')
  async deleteSeed(@Param('id') id: string) {
    return await this.seedService.deleteSeed(id);
  }
}
