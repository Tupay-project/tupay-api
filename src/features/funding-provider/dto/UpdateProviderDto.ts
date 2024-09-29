import { IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderDto {
  @ApiProperty({ description: 'Nombre del proveedor', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'URL del webhook', required: false })
  @IsUrl()
  @IsOptional()
  webhookUrl?: string;

  @ApiProperty({ description: 'Fondos disponibles', required: false })
  @IsNumber()
  @IsOptional()
  availableFunds?: number;
}
