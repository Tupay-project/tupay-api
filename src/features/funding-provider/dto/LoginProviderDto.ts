import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginProviderDto {
  @ApiProperty({ description: 'AccessKey del proveedor' })
  @IsString()
  @IsNotEmpty()
  accessKey: string;

  @ApiProperty({ description: 'PrivateKey del proveedor' })
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
