import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
  @Field(() => Customer) // Decorador de campo para GraphQL
  customer: Customer;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @Field() // Decorador de campo para GraphQL
  amount: number;  // Monto de la factura

  @Column()
  @Field() // Decorador de campo para GraphQL
  description: string;  // Descripción del producto o servicio

  @Column()
  @Field() // Decorador de campo para GraphQL
  issueDate: Date;  // Fecha de emisión de la factura

  @Column()
  @Field() // Decorador de campo para GraphQL
  dueDate: Date;  // Fecha de vencimiento de la factura

  @Column({ default: 'pending' })
  @Field() // Decorador de campo para GraphQL
  status: string;  // Estado de la factura (e.g., 'pending', 'paid', 'overdue')

  @Column({ default: '1232' })
  @Field() // Decorador de campo para GraphQL
  numberAgreement: string;  // Número de convenio fijo

  @Column({ length: 5 })
  @Field() // Decorador de campo para GraphQL
  paymentReference: string;  // Referencia de pago generada automáticamente (5 dígitos)

  @OneToMany(() => Transaction, (transaction) => transaction.invoice)
  @Field(() => [Transaction]) // Decorador de campo para GraphQL
  transactions: Transaction[];

  @Column()
  @Field() // Decorador de campo para GraphQL
  paymentLink: string;  // Link de pago generado

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @UpdateDateColumn()
  @Field() // Decorador de campo para GraphQL
  updatedAt: Date;
}
