import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) 
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
  @Field(() => Customer) 
  customer: Customer;

  @ManyToOne(() => FundingProvider, provider => provider.invoices)
  provider: FundingProvider;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @Field() 
  amount: number;  // Monto de la factura

  @Column()
  @Field() 
  description: string;  // Descripción del producto o servicio

  @Column()
  @Field() 
  issueDate: Date;  // Fecha de emisión de la factura

  @Column()
  @Field() 
  dueDate: Date;  // Fecha de vencimiento de la factura

  @Column({ default: 'pending' })
  @Field() 
  status: string;  // Estado de la factura (e.g., 'pending', 'paid', 'overdue')

  @Column({ default: '1232' })
  @Field() 
  numberAgreement: string;  // Número de convenio fijo

  @Column({ length: 15, })
  @Field() 
  paymentReference: string;  // Referencia de pago generada automáticamente (5 dígitos)

  @OneToMany(() => Transaction, (transaction) => transaction.invoice)
  @Field(() => [Transaction]) 
  transactions: Transaction[];

  @Column()
  @Field() 
  paymentLink: string;  // Link de pago generado

  @CreateDateColumn()
  @Field() 
  createdAt: Date;

  @UpdateDateColumn()
  @Field() 
  updatedAt: Date;
}
