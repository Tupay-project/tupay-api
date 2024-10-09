import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ProviderService } from 'src/features/provider/provider.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly fundingProviderService: ProviderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Obtener las claves del encabezado de la solicitud
    const accessKey = request.headers['accesskey'] as string;
    const privateKey = request.headers['privatekey'] as string;

    // Verificar que ambas claves se proporcionen
    if (!accessKey || !privateKey) {
      throw new UnauthorizedException('Access Key or Private Key missing');
    }

    // Llamar al servicio FundingProviderService para validar las claves directamente
    const provider = await this.fundingProviderService.getProviderByKeys(accessKey, privateKey);

    if (!provider) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true; // Si el proveedor existe y las claves coinciden, permitir el acceso
  }
}
