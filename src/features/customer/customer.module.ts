import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { ProviderService } from '../provider/provider.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService,ProviderService],
})
export class CustomerModule {}
