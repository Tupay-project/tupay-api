import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFundsDto {
  @ApiProperty({ description: 'Monto a agregar', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)  
  amount: number;
}
