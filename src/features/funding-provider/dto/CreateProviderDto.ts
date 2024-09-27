import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ description: 'Nombre del proveedor', example: 'Proveedor XYZ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Número de cuenta del proveedor', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Estado del proveedor', example: 'active' })
  @IsString()
  @IsIn(['active', 'inactive'])  // Acepta solo 'active' o 'inactive'
  status: string;

  @ApiProperty({ description: 'Tipo de proveedor', example: 'company' })
  @IsString()
  @IsIn(['company', 'person', 'bank'])  // Acepta solo 'company', 'person', 'bank'
  type: string;

  @ApiProperty({ description: 'Fondos disponibles', example: 1000000 })
  @IsNumber()
  @IsNotEmpty()
  availableFunds: number;
}
