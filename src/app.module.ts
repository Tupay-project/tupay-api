import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PgModule } from './shared/modules';
import { CustomerModule } from './features/customer/customer.module';
import { RoleModule } from './features/role/role.module';
import { RolesService } from './features/role/role.service';
import { FundingProviderModule } from './features/funding-provider/funding-provider.module';

@Module({
  imports: [
    //  config
    PgModule,
    AuthModule,
    UserModule,
    CustomerModule,
    RoleModule,
    FundingProviderModule

  
  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
