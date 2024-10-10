import { IsString, IsUUID } from 'class-validator';

export class GetInvoicesByProviderDto {
  @IsUUID()
  providerId: string;
}
