import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Monto del pago', example: 150.75 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Método de pago', example: 'Credit Card' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Referencia de pago', example: '12345' })
  @IsString()
  @IsNotEmpty()
  paymentReference: string;

  @ApiProperty({ description: 'ID del proveedor de fondos', example: 'uuid-del-proveedor' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'Referencia única de la transacción', example: 'TXN12345' })
  @IsString()
  @IsNotEmpty()
  reference: string;  // Referencia única de la transacción

  @ApiProperty({ description: 'El ID del usuario que realiza el pago' })
  @IsNotEmpty()
  @IsString()
  userId: string; 
}
