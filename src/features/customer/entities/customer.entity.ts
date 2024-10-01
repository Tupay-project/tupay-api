import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';

@ObjectType() // Decorador para GraphQL
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) // Decorador de campo para GraphQL
  id: string;

  @Column({ unique: true })
  @Field() // Decorador de campo para GraphQL
  governmentId: string;  // ID del gobierno (cédula o similar)

  @Column()
  @Field() // Decorador de campo para GraphQL
  email: string;  // Email del cliente

  @Column()
  @Field() // Decorador de campo para GraphQL
  name: string;  // Nombre del cliente

  @Column()
  @Field() // Decorador de campo para GraphQL
  phoneNumber: string;  // Número de teléfono del cliente

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  @Field(() => [Invoice]) // Lista de facturas asociadas
  invoices: Invoice[];

  @OneToOne(() => User, (user) => user.customer) // Relación uno a uno con User
  @Field(() => User) // Relación uno a uno en GraphQL
  user?: User;

  @ManyToOne(() => FundingProvider, (provider) => provider.customers, { eager: true })
  @Field(() => FundingProvider) // Relación con FundingProvider en GraphQL
  provider: FundingProvider;
}
