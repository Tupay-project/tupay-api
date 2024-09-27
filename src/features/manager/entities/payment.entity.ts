import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Transaction } from './transaction.entity';
import { Provider } from 'src/features/funding-provider/entities/provider.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number;

  @Column({ default: 'completed' })
  status: string;

  @ManyToOne(() => Provider)
  provider: Provider;

  @ManyToOne(() => Transaction)
  transaction: Transaction;

  @Column()
  paymentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
