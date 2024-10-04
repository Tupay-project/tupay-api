import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PgModule } from './shared/modules';
import { CustomerModule } from './features/customer/customer.module';
import { RoleModule } from './features/role/role.module';
import { RolesService } from './features/role/role.service';

@Module({
  imports: [
    //  config
    PgModule,
    AuthModule,
    UserModule,
    CustomerModule,
    RoleModule,

  
  ],
  controllers: [],
  providers: [AppService,RolesService],
})
export class AppModule {}
