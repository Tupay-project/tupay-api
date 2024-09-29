import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/features/api-key/entities/api-key.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { BankTransaction } from 'src/features/invoice/entities/bank-transaction.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { Loan } from 'src/features/loan/entities/loan.entity';
import { Payment } from 'src/features/manager/entities/payment.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { WebhookLog } from 'src/features/manager/entities/webhook-log.entity';
import { Permission } from 'src/features/role/entities/permission.entity';
import { Role } from 'src/features/role/entities/roles.entity';
import { User } from 'src/features/user/entities/user.entity';
// import { ApiKey } from 'src/features/api-key/entities/api-key.entity';
// import { CreditRequest } from 'src/features/credit/entities/credit.entity';
// import { FundingProvider } from 'src/features/funding-provider/entitie/funding.entity';
// import { Permission } from 'src/features/users/entities/permission.entity';
// import { Role } from 'src/features/users/entities/roles.entity';
// import { User } from 'src/features/users/entities/user.entity';
// import { WithdrawalRequest } from 'src/features/withdrawal/entitie/WithdrawalRequest.entity';
import { envs } from 'src/shared/config';
import { SeedEntity } from 'src/shared/seed/entitie/seed-entity';


@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DATABASE_HOST,
      port: 5432,
      username: envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      database: envs.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 10,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 30000,
      },

    }),

    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      ApiKey,
      Invoice,
      Customer,
      WebhookLog,
      Payment,
      FundingProvider,
      BankTransaction,
      Transaction,
      SeedEntity,
      // 
      Loan
    ])



  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class PgModule { }
