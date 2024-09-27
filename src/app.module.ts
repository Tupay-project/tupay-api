import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { ApiKeyModule } from './features/api-key/api-key.module';
import { CreditModule } from './features/credit/credit.module';
import { FundingProviderModule } from './features/funding-provider/funding-provider.module';
import { ManagerModule } from './features/manager/manager.module';
import { WithdrawalModule } from './features/withdrawal/withdrawal.module';
import { DocumentationModule } from './shared/modules/documentation/documentation.module';
import { AppGraphQLModule, PgModule } from './shared/modules';
import { IntegrationsModule } from './features/integrations/integrations.module';
import { SeedModule } from './shared/seed/seed.module';

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
    CreditModule,
    FundingProviderModule,
    ManagerModule,
    WithdrawalModule,
    IntegrationsModule,
    SeedModule,
  
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
