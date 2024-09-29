import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';  // Ajusta el path a la entidad FundingProvider
import { Invoice } from 'src/features/invoice/entities/invoice.entity';

@ObjectType() // Decorador para GraphQL
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) 
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.transactions, { eager: true })
  @Field(() => Invoice) // Relación con Invoice en GraphQL
  invoice: Invoice;

  @ManyToOne(() => FundingProvider, (provider) => provider.transactions, { eager: true })
  @Field(() => FundingProvider) // Relación con FundingProvider en GraphQL
  provider: FundingProvider;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field() 
  amount: number;

  @Column()
  @Field() 
  paymentReference: string;  // Referencia de pago generada

  @Column({ default: 'success' })
  @Field() 
  status: string;  // 'success' o 'failed'

  @CreateDateColumn()
  @Field() 
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true }) 
  failureReason?: string;  // Motivo del fallo en caso de 'failed'
  
  
  @Field({ nullable: true }) 
  @Column()
  type: 'credit' | 'debit'; 

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  metadata?: Record<string, any>;  // Datos adicionales como la respuesta del banco, etc.
}
