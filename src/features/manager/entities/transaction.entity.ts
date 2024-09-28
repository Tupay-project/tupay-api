import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';  // Ajusta el path a la entidad FundingProvider
import { Invoice } from 'src/features/invoice/entities/invoice.entity';

@ObjectType() // Decorador para GraphQL
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.transactions, { eager: true })
  @Field(() => Invoice) // Relación con Invoice en GraphQL
  invoice: Invoice;

  @ManyToOne(() => FundingProvider, (provider) => provider.transactions, { eager: true })
  @Field(() => FundingProvider) // Relación con FundingProvider en GraphQL
  provider: FundingProvider;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field() // Decorador de campo para GraphQL
  amount: number;

  @Column()
  @Field() // Decorador de campo para GraphQL
  paymentReference: string;  // Referencia de pago generada

  @Column({ default: 'success' })
  @Field() // Decorador de campo para GraphQL
  status: string;  // 'success' o 'failed'

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Decorador de campo para GraphQL
  failureReason?: string;  // Motivo del fallo en caso de 'failed'

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true }) // Decorador de campo para GraphQL, se usa String para JSON
  metadata?: Record<string, any>;  // Datos adicionales como la respuesta del banco, etc.
}
