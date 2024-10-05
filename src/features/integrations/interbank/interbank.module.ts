import { Module } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { InterbankController } from './interbank.controller';
import { InvoiceModule } from 'src/features/invoice/invoice.module';
import { FundingProviderModule } from 'src/features/funding-provider/funding-provider.module';
import { CustomerModule } from 'src/features/customer/customer.module';
// import { PrinterModule } from 'src/shared/modules/printer/printer.module';
// import { CloudinaryModule } from 'src/shared/modules/cloudinary/cloudinary.module';

@Module({
  controllers: [
    InterbankController,
  ],
  providers: [InterbankService],

  imports:[
    InvoiceModule,
    FundingProviderModule,
    CustomerModule
  ]
})
export class InterbankModule {}
