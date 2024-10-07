import { Module } from '@nestjs/common';
import { AppService } from './app.service';

import {  PgModule } from './shared/modules';
import { RolesService } from './features/role/role.service';
import { ProviderModule } from './features/provider/provider.module';
import { CustomerModule } from './features/customer/customer.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { InterbankModule } from './features/integrations/interbank/interbank.module';
import { TokuModule } from './features/integrations/toku/toku.module';
import { AuthModule } from './features/auth/auth.module';
import { EmailModule } from './shared/modules/email/email.module';


@Module({
  imports: [
    //  config
    PgModule,
    ProviderModule,
    CustomerModule,
    InvoicesModule,
    InterbankModule,
    TokuModule,
    AuthModule,
    EmailModule
    // features


  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
