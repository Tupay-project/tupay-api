import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
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
  @IsNotEmpty()
  phoneNumber: string;  // Número de teléfono del cliente

  @ApiProperty({ description: 'ID del proveedor asociado', example: '4e91e43b-c8e7-4782-b3c9-0d318f801fd9' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;  // ID del proveedor

  @ApiProperty({ description: 'Número de cuenta del proveedor', example: '1234567890' })  // Asegúrate de incluir esto
  @IsString()
  @IsNotEmpty()
  accountNumber: string;  // Número de cuenta del proveedor

  @ApiProperty({ description: 'URL del webhook del proveedor', example: 'https://miwebhook.com/notify' })
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;

  @ApiProperty({ description: 'Tipo de proveedor (persona o compañía)', example: 'company' })
  @IsString()
  @IsNotEmpty()
  type: string;  // Tipo de proveedor

  @ApiProperty({ description: 'Fondos disponibles', example: 1000000 })
  @IsNumber()
  @IsNotEmpty()
  availableFunds: number;
}
