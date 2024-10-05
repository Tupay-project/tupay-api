import { Module } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { InterbankController } from './interbank.controller';
import { CashInController,CashInService,CashOutController,CashOutService } from '.';
import { PrinterModule } from 'src/shared/modules/printer/printer.module';
import { CloudinaryModule } from 'src/shared/modules/cloudinary/cloudinary.module';

@Module({
  controllers: [
    InterbankController,
    // CashOutController,
    // CashInController
  ],
  providers: [InterbankService,CashInService,CashOutService],

  imports:[PrinterModule,CloudinaryModule]
})
export class InterbankModule {}
