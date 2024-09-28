import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RolesService } from '../role/role.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/shared/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService,RolesService],
  imports:[UserModule,    JwtModule.registerAsync({
    useFactory:()=>{
      return {
        signOptions:{expiresIn:'24h'},
        secret:envs.JWT_ACCESS_TOKEN_SECRET
      }
    }
        }),]
})
export class AuthModule {}
