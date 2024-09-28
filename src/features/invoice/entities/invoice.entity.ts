import { Customer } from 'src/features/customer/entities/customer.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
  customer: Customer;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;  // Monto total de la factura

  @Column()
  description: string;  // Descripción del producto o servicio

  @Column()
  issueDate: Date;  // Fecha de emisión de la factura

  @Column()
  dueDate: Date;  // Fecha de vencimiento de la factura

  @Column({ default: 'pending' })
  status: string;  // Estado de la factura (e.g., 'pending', 'paid', 'overdue')

  @Column({ default: '1232' })  // Número de convenio fijo
  numberAgreement: string;

  @Column({ length: 5 })  // Referencia de pago generada automáticamente (5 dígitos)
  paymentReference: string;
  @OneToMany(() => Transaction, (transaction) => transaction.invoice)
  transactions: Transaction[];
  
  @Column()
  paymentLink: string;  // Link de pago generado
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
