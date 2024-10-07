import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Referencia de la factura',
    example: 'INV-12345',
  })
  @IsNotEmpty()
  @IsString()
  invoiceReference: string;  // Referencia de la factura

  @ApiProperty({
    description: 'Referencia del cliente',
    example: 'CUST-54321',
  })
  @IsNotEmpty()
  @IsString()
  customerReference: string;  // Referencia del cliente

  @ApiProperty({
    description: 'Monto del pago en centavos',
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;  // Monto del pago

  @ApiProperty({
    description: 'ID del proveedor seleccionado',
    example: 'e8b5d1a4-1a62-4e76-9877-36e16fd0583c',
  })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;  // ID del proveedor seleccionado
}
