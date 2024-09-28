import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { Subscription } from 'src/features/subscription/entities/subscription.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';


@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid') // Define el ID como UUID si usas UUIDs
  id: string;

  @Column({ unique: true })
  governmentId: string;  // ID del gobierno (cédula o similar)

  @Column()
  email: string;  // Email del cliente

  @Column()
  name: string;  // Nombre del cliente

  @Column()
  phoneNumber: string;  // Número de teléfono del cliente

  // integrations
  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Subscription[];

  
  @OneToOne(() => User, user => user.customer) // Relación uno a uno
  user: User; 

  @ManyToOne(() => FundingProvider, (provider) => provider.customers, { eager: true })
  provider: FundingProvider;


 
}
