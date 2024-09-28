import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { FundingProviderModule } from '../funding-provider/funding-provider.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports:[FundingProviderModule],
  exports:[CustomerService]
})
export class CustomerModule {}
