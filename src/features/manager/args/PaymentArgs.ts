import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class PaymentArgs {
  @Field()
  @IsUUID()
  id: string;
}
