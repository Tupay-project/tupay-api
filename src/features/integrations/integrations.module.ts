import { Module } from '@nestjs/common';
import { TokuModule } from './toku/toku.module';
import { InterbankModule } from './interbank/interbank.module';

@Module({
  imports: [TokuModule, InterbankModule]
})
export class IntegrationsModule {}
