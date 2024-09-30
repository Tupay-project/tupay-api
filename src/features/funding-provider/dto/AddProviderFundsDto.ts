import { IsNumber, IsNotEmpty, Min, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProviderFundsDto {
  @ApiProperty({
    description: 'Monto a agregar a la cuenta del proveedor',
    example: 5000, // en centavos o la unidad de tu moneda
  })
  @IsNumber()
  @IsPositive()
  @Min(1)  // Asegura que el monto sea positivo
  amount: number;

  @ApiProperty({
    description: 'ID del proveedor que recibe los fondos',
    example: 'provider_123',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  currency: string;  // Moneda como 'usd', 'eur', etc.
}
