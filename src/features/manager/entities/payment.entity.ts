import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field() // Decorador de campo para GraphQL
  amountPaid: number;

  @Column({ default: 'completed' })
  @Field() // Decorador de campo para GraphQL
  status: string;

  @Column()
  @Field() // Decorador de campo para GraphQL
  paymentDate: Date;

  @CreateDateColumn()
  @Field() // Decorador de campo para GraphQL
  createdAt: Date;

  @UpdateDateColumn()
  @Field() // Decorador de campo para GraphQL
  updatedAt: Date;
}
