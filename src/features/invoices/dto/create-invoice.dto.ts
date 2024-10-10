import { IsNotEmpty, IsUUID, IsNumber, IsDateString, IsString, IsOptional, IsIn, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {


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


  @ApiProperty({ description: 'Referencia de pago', example: 'testabc123' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ description: 'Número de cuenta bancaria', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Número de convenio con el banco', example: '2686' })
  @IsString()
  @IsNotEmpty()
  bankAgreementNumber: string;

  @ApiProperty({ description: 'Número de recibo', example: '12345' })
  @IsString()
  @IsNotEmpty()
  paymentReceipt: string;


  @ApiProperty({ description: 'Tipo de moneda', example: 'COP' })
  @IsString()
  @IsIn(['COP', 'USD'])  // Limitar a COP o USD
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Número de documento de identidad del usuario', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  numdoc: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Luis Perez' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: '3002222222' })
  @IsOptional()
  userphone?: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'Prueba@toppaylatam.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tipo de transacción', example: '1', enum: [1, 3] })
  @IsString()
  @IsIn(['1', '3'])  // Limitar a '1' o '3'
  @IsNotEmpty()
  typetransaction: string;

  @ApiProperty({ description: 'Método de pago', example: 'GEN', enum: ['GEN', 'PSE', 'NEQUI', 'DAVIPLATA', 'EFECTY', 'EFECTIVO'] })
  @IsString()
  @IsIn(['GEN', 'PSE', 'NEQUI', 'DAVIPLATA', 'EFECTY', 'EFECTIVO'])  // Limitar a los métodos válidos
  @IsNotEmpty()
  method: string;
}
