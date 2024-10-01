import { Module } from '@nestjs/common';
import { FundingProviderService } from './funding-provider.service';
import { FundingProviderController } from './funding-provider.controller';
import { ApiKeyModule } from '../api-key/api-key.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/shared/config';
import { HttpModule } from '@nestjs/axios';
import { WebhookControllerTransfeProvider } from './controllers/webhook.controller';

@Module({
  controllers: [FundingProviderController,WebhookControllerTransfeProvider],
  providers: [FundingProviderService],
  imports:[ApiKeyModule,  
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '24h' },
          secret: envs.JWT_ACCESS_TOKEN_SECRET,
        };
      },
    }),
    HttpModule
  
  ],
  exports:[FundingProviderService]
})
export class FundingProviderModule {}
