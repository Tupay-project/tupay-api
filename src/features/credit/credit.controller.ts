import { Controller } from '@nestjs/common';
import { CreditService } from './credit.service';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}
}
