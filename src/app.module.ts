import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PgModule } from './shared/modules';
import { AuthModule } from './features/auth/auth.module';
<<<<<<< HEAD
import { UserModule } from './features/user/user.module';
import { PgModule } from './shared/modules';
import { CustomerModule } from './features/customer/customer.module';
import { RoleModule } from './features/role/role.module';
import { RolesService } from './features/role/role.service';
import { FundingProviderModule } from './features/funding-provider/funding-provider.module';
import { InterbankModule } from './features/integrations/interbank/interbank.module';
import { InvoiceModule } from './features/invoice/invoice.module';
import { PaymentModule } from './features/payment/payment.module';
=======
import { CustomerModule } from './features/customer/customer.module';
import { InterbankModule } from './features/integrations/interbank/interbank.module';
import { TokuModule } from './features/integrations/toku/toku.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { ProviderModule } from './features/provider/provider.module';
import { RolesService } from './features/role/role.service';
import { EmailModule } from './shared/modules/email/email.module';
>>>>>>> features/integratins/interback




@Module({
  imports: [
    //  config
    PgModule,
<<<<<<< HEAD
    // AuthModule,
    // UserModule,
    // CustomerModule,
    RoleModule,
    // FundingProviderModule,
    InterbankModule,
    // InvoiceModule,
    // PaymentModule
    

  
=======
    ProviderModule,
    CustomerModule,
    InvoicesModule,
    InterbankModule,
    TokuModule,
    AuthModule,
    EmailModule
    // features


>>>>>>> features/integratins/interback
  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
