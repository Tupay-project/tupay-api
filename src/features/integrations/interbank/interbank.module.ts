import { Module } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { InterbankController } from './interbank.controller';

@Module({
  controllers: [InterbankController],
  providers: [InterbankService],
})
export class InterbankModule {}
