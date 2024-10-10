
import { IsNotEmpty, IsString, IsNumber, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Referencia del pago', example: 'ref-12345' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ description: 'Monto del pago', example: 150.75 })
  @IsNotEmpty()
  @IsString()
  amount: number;

  @ApiProperty({ description: 'Moneda del pago', example: 'COP' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Número de documento del cliente', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  numdoc: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Luis Perez' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Teléfono del cliente', example: '3001234567' })
  @IsString()
  userphone: string;

  @ApiProperty({ description: 'Correo del cliente', example: 'cliente@test.com' })
  @IsEmail()
  @IsNotEmpty()
  useremail: string;

  @ApiProperty({ description: 'Tipo de transacción', example: '1' })
  @IsString()
  @IsNotEmpty()
  typetransaction: string;

  @ApiProperty({ description: 'Método de pago', example: 'GEN' })
  @IsString()
  @IsNotEmpty()
  method: string;
}
