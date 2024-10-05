import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PgModule } from './shared/modules';
import { CustomerModule } from './features/customer/customer.module';
import { RoleModule } from './features/role/role.module';
import { RolesService } from './features/role/role.service';
import { FundingProviderModule } from './features/funding-provider/funding-provider.module';
import { InterbankModule } from './features/integrations/interbank/interbank.module';
import { InvoiceModule } from './features/invoice/invoice.module';
import { PaymentModule } from './features/payment/payment.module';

@Module({
  imports: [
    //  config
    PgModule,
    // AuthModule,
    // UserModule,
    // CustomerModule,
    RoleModule,
    // FundingProviderModule,
    InterbankModule,
    // InvoiceModule,
    // PaymentModule
    

  
  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
