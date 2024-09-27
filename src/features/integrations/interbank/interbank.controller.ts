import { Controller } from '@nestjs/common';
import { InterbankService } from './interbank.service';

@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}
}
