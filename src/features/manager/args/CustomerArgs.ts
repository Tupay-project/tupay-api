import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class CustomerArgs {
  @Field()
  @IsUUID()
  id: string;
}
