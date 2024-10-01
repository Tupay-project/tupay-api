import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID de la factura asociada', example: 'uuid-de-la-factura' })
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;  // UUID de la factura asociada

  @ApiProperty({ description: 'Referencia del pago', example: '12345' })
  @IsString()
  @IsNotEmpty()
  paymentReference: string;  // Referencia del pago

  @ApiProperty({ description: 'Monto del pago', example: 150.75 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;  // Monto del pago

  @ApiProperty({ description: 'ID del proveedor de fondos', example: 'uuid-del-proveedor' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;  // UUID del proveedor de fondos

  @ApiProperty({ description: 'Estado de la transacción', example: 'success' })
  @IsString()
  @IsNotEmpty()
  status: string;  // Estado de la transacción (success, failed)

  @ApiProperty({ description: 'Razón de falla (si aplica)', example: 'Fondos insuficientes' })
  @IsString()
  failureReason?: string;  // Razón del fallo (opcional)
  
  
  @IsString()
  paymentMethod:string
  @IsString()
  reference:string

  @ApiProperty({ description: 'Tipo de transacción', example: 'credit' })
  @IsString()
  @IsNotEmpty()
  type: 'credit' | 'debit'; 
}
