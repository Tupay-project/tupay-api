import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'ID del gobierno (cédula o similar)', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  governmentId: string;  // ID del gobierno (cédula o similar)

  @ApiProperty({ description: 'Email del cliente', example: 'cliente@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;  // Email del cliente

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;  // Nombre del cliente

  @ApiProperty({ description: 'Número de teléfono del cliente', example: '+573004567890' })
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phoneNumber: string;  // Número de teléfono del cliente

  @ApiProperty({ description: 'ID del proveedor asociado', example: '4e91e43b-c8e7-4782-b3c9-0d318f801fd9' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;  // ID del proveedor
}
