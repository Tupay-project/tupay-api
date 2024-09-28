import { Module } from '@nestjs/common';
import { FundingProviderService } from './funding-provider.service';
import { FundingProviderController } from './funding-provider.controller';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  controllers: [FundingProviderController],
  providers: [FundingProviderService],
  imports:[ApiKeyModule],
  exports:[FundingProviderService]
})
export class FundingProviderModule {}
