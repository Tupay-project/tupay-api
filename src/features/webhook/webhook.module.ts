import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { FundingProviderModule } from '../funding-provider/funding-provider.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios'; // Importamos HttpModule
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/shared/config';

@Module({
  imports: [
    FundingProviderModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '24h' },
          secret: envs.JWT_ACCESS_TOKEN_SECRET,
        };
      },
    }),
    HttpModule, // Aseguramos que HttpModule está importado correctamente
  ],
  controllers: [WebhookController],
  providers: [WebhookService, ConfigService, JwtService], // Asegúrate de que esté en 'providers'

})
export class WebhookModule {}