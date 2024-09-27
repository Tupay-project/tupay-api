import { Controller, Get, UseGuards } from '@nestjs/common';
import { FundingProviderService } from './funding-provider.service';
import { AccessKeyGuard } from 'src/shared/guards/accessKey.guard';

@Controller('funding-provider')
export class FundingProviderController {
  constructor(private readonly fundingProviderService: FundingProviderService) {}

  @Get('data')
  @UseGuards(AccessKeyGuard) // Aplicamos el Guard
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
