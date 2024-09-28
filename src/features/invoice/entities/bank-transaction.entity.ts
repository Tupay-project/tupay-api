import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('bank_transactions')
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.id, { eager: true })
  @Field(() => Invoice) // Decorador de campo para GraphQL
  invoice: Invoice;  // Relación con la factura asociada

  @ManyToOne(() => FundingProvider, (provider) => provider.id, { eager: true })
  @Field(() => FundingProvider) // Decorador de campo para GraphQL
  provider: FundingProvider;  // Proveedor de fondos

  @Column()
  @Field() // Decorador de campo para GraphQL
  status: string;  // Estado de la transacción (success/failed)

  @Column()
  @Field() // Decorador de campo para GraphQL
  transactionDate: Date;  // Fecha de la transacción

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @UpdateDateColumn()
  @Field() // Decorador de campo para GraphQL
  updatedAt: Date;
}
