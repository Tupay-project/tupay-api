<<<<<<< HEAD
import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { Payment } from 'src/features/payment/entitie/payment.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';
=======
import { Interbank } from 'src/features/integrations/interbank/entities/interbank.entity';
import { Invoice } from 'src/features/invoices/entities/invoice.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
>>>>>>> features/integratins/interback

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

<<<<<<< HEAD
  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];

  @Column({ unique: true })
  @Field() // Decorador de campo para GraphQL
=======
  @OneToMany(() => Interbank, (payment) => payment.customer)
  payments: Interbank[];

  @Column({ unique: true })  
>>>>>>> features/integratins/interback
  governmentId: string;  // ID del gobierno (cédula o similar)

  @Column()  
  email: string;  // Email del cliente

  @Column()  
  name: string;  // Nombre del cliente

  @Column()  
  phoneNumber: string;  // Número de teléfono del cliente

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @ManyToOne(() => PaymentProvider, (provider) => provider.customers, { eager: true })
  provider: PaymentProvider;
}
