import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from 'src/features/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Obtener las claves del encabezado de la solicitud
    const accessKey = request.headers['x-access-key'] as string;
    const privateKey = request.headers['x-private-key'] as string;
    console.log('accessKey',request.headers)
    console.log('privateKey',request.headers)

    if (!accessKey || !privateKey) {
      throw new UnauthorizedException('Access Key or Private Key missing');
    }

    // Validar las claves con el servicio ApiKeyService
    const isValid = await this.apiKeyService.validateKeys(accessKey, privateKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true; // Si la validación es correcta, se permite el acceso
  }
}
