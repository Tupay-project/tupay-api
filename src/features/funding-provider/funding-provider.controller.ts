import { Controller } from '@nestjs/common';
import { FundingProviderService } from './funding-provider.service';

@Controller('funding-provider')
export class FundingProviderController {
  constructor(private readonly fundingProviderService: FundingProviderService) {}
}
