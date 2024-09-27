import { Module } from '@nestjs/common';
import { FundingProviderService } from './funding-provider.service';
import { FundingProviderController } from './funding-provider.controller';

@Module({
  controllers: [FundingProviderController],
  providers: [FundingProviderService],
})
export class FundingProviderModule {}
