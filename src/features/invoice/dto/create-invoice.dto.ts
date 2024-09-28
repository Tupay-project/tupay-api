import { IsNotEmpty, IsUUID, IsNumber, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID del cliente asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Monto de la factura', example: 150.75 })
  @IsNumber({}, { message: 'El monto debe ser un número decimal válido' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Descripción del producto o servicio', example: 'Compra de productos' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Fecha de emisión', example: '2024-09-28T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: Date;

  @ApiProperty({ description: 'Fecha de vencimiento', example: '2024-10-28T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ description: 'Número de convenio del banco', example: '1232', required: false })
  @IsOptional()  // Este campo será opcional ya que lo generamos en el servicio
  @IsString()
  numberAgreement?: string;

  @ApiProperty({ description: 'Referencia de pago generada automáticamente', example: '54321', required: false })
  @IsOptional()  // Este campo será opcional ya que lo generamos en el servicio
  @IsString()
  paymentReference?: string;
}
