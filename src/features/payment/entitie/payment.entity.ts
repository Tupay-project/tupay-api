import { Customer } from 'src/features/customer/entities/customer.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentStatus {
  REJECT = 'REJECT',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ length: 100 })

  refInvoinces: string;

  
  @Column({ length: 100 })
  refInCustomer: string;

  @Column({ length: 100 })
  IdSession: string;

  @ManyToOne(() => Customer, (customer) => customer.payments, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => FundingProvider, (provider) => provider.payments, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider: FundingProvider;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, { eager: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
