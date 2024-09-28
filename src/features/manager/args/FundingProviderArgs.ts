import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class FundingProviderArgs {
  @Field()
  @IsUUID()
  id: string;
}
