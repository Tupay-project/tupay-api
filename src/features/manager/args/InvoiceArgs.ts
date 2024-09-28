import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class InvoiceArgs {
  @Field()
  @IsUUID()
  id: string;
}
