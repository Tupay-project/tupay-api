import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @Column({ length: 100 })
  @Field() // Decorador de campo para GraphQL
  name: string;

  @Column({ unique: true })
  @Field() // Decorador de campo para GraphQL
  email: string;

  @Column({ length: 20 })
  @Field() // Decorador de campo para GraphQL
  role: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field() // Decorador de campo para GraphQL
  balance: number;

  @Column({ unique: true, length: 20 })
  @Field() // Decorador de campo para GraphQL
  accountNumber: string;

  @Column({ default: 'active' })
  @Field() // Decorador de campo para GraphQL
  status: string;

  @OneToOne(() => Customer, customer => customer.user) 
  @JoinColumn()
  @Field(() => Customer) // Decorador de campo para GraphQL
  customer: Customer;

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @UpdateDateColumn()
  @Field() // Decorador de campo para GraphQL
  updatedAt: Date;
}
