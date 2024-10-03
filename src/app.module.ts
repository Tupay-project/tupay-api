import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { ApiKeyModule } from './features/api-key/api-key.module';
import { FundingProviderModule } from './features/funding-provider/funding-provider.module';
import { ManagerModule } from './features/manager/manager.module';
import { DocumentationModule } from './shared/modules/documentation/documentation.module';
import { AppGraphQLModule, PgModule } from './shared/modules';
import { IntegrationsModule } from './features/integrations/integrations.module';
import { SeedModule } from './shared/seed/seed.module';
import { CustomerModule } from './features/customer/customer.module';
import { InvoiceModule } from './features/invoice/invoice.module';
import { PaymentModule } from './features/payment/payment.module';
import { RoleModule } from './features/role/role.module';
import { RolesService } from './features/role/role.service';
import { LoanModule } from './features/loan/loan.module';
import { WebhookModule } from './features/webhook/webhook.module';
import { EmailModule } from './shared/modules/email/email.module';

@Module({
  imports: [
    //  config
    DocumentationModule,
    PgModule,
    AppGraphQLModule,
    // features

    AuthModule,
    UserModule,
    ApiKeyModule,
    
    FundingProviderModule,
    ManagerModule,
    LoanModule,
    IntegrationsModule,
    SeedModule,
    CustomerModule,
    InvoiceModule,
    PaymentModule,
    RoleModule,
    WebhookModule,
    EmailModule,
  
  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
