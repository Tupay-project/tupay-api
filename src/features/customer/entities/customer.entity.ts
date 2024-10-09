import { Interbank } from 'src/features/integrations/interbank/entities/interbank.entity';
import { Invoice } from 'src/features/invoices/entities/invoice.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';  // Importamos Exclude

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Interbank, (payment) => payment.customer)
  payments: Interbank[];

  @Column({ unique: true })  
  governmentId: string;  // ID del gobierno (cédula o similar)

  @Column()  
  email: string;  // Email del cliente

  @Column()  
  name: string;  // Nombre del cliente

  @Column()  
  phoneNumber: string;  // Número de teléfono del cliente

  // @OneToMany(() => Invoice, (invoice) => invoice.customer)
  // invoices: Invoice[];

  @ManyToOne(() => PaymentProvider, (provider) => provider.customers, { eager: true })
  @Exclude()  // Excluye el campo provider de la serialización
  provider: PaymentProvider;
}
