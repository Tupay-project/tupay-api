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
    IntegrationsModule,
    SeedModule,
    CustomerModule,
    InvoiceModule,
  
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
