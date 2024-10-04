import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'ID del gobierno (cédula o similar)', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  governmentId: string;  // ID del gobierno (cédula o similar)

  @ApiProperty({ description: 'Email del cliente', example: 'customer@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;  // Email del cliente

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;  // Nombre del cliente

  @ApiProperty({ description: 'Número de teléfono del cliente', example: '+573004567890' })
  @IsString()
  phoneNumber: string;  // Número de teléfono del cliente
 
 
  @IsString()
  providerId: string; // Agregar este campo si no lo tienes
  
}
