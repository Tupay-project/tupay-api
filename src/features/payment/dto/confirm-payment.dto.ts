import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsIn(['success', 'failed'])
  status: string;
}
