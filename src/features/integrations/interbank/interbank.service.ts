/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/features/customer/customer.service';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InterbankService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>, 

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,

    private readonly customerService: CustomerService, 
  ){}
}
