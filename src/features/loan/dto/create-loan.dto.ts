import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  borrowerId: string; // ID del prestatario (Usuario)

  @IsNumber()
  @IsPositive()
  amount: number; // Monto del préstamo

  @IsNumber()
  @IsPositive()
  interestRate: number; // Tasa de interés del préstamo
}
