import { Injectable } from "@nestjs/common";
import { RolesService } from "./features/role/role.service";

@Injectable()
export class AppService {
  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    const roles = await this.rolesService.listAllRoles();

    // Si no existen roles, inicialízalos
    if (roles.length === 0) {
      await this.rolesService.initializeRolesAndPermissions();
      console.log('Roles and Permissions initialized');
    } else {
      console.log('Roles and Permissions already initialized');
    }

    // Crear rol provider manualmente si no está creado
    await this.rolesService.createRole('provider', [
      'view_provider_transactions',
      'confirm_payment',
      'view_provider_balance',
      'manage_provider_payments',
      'view_provider_invoices',
      'generate_invoice',
      'pay_invoice',
      'configure_webhook',
      'view_webhook_logs',
      'manage_provider_integrations',
      'view_provider_audit_logs',
    ]);
    console.log('Provider role initialized');
  }
}
