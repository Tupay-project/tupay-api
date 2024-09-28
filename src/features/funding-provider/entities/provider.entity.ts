import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@ObjectType() // Decorador necesario para GraphQL
@Entity('providers')
export class FundingProvider {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @Column({ length: 100 })
  @Field() // Decorador de campo para GraphQL
  name: string;

  @Column({ unique: true, length: 20 })
  @Field() // Decorador de campo para GraphQL
  accountNumber: string;

  @Column({ default: 'active' })
  @Field() // Decorador de campo para GraphQL
  status: string;

  @Column()
  @Field() // Decorador de campo para GraphQL
  type: string; // Puede ser 'bank', 'person', 'company'

  @Column({ unique: true })
  @Field() // Decorador de campo para GraphQL
  privateKey: string;

  @OneToMany(() => Customer, (customer) => customer.provider)
  @Field(() => [Customer]) // Indica que es una lista de Customer en GraphQL
  customers: Customer[];

  @OneToMany(() => Transaction, (transaction) => transaction.provider)
  @Field(() => [Transaction]) // Indica que es una lista de Transaction en GraphQL
  transactions: Transaction[];

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Puede ser nulo en GraphQL
  webhookUrl: string;

  @Column({ type: 'decimal', default: 0, nullable: false })
  @Field() // Decorador de campo para GraphQL
  availableFunds: number;

  @UpdateDateColumn()
  @Field() // Decorador de campo para GraphQL
  updatedAt: Date;
}
