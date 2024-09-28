import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';  // Ajusta el path a la entidad FundingProvider
import { Invoice } from 'src/features/invoice/entities/invoice.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.transactions, { eager: true })
  invoice: Invoice;

  @ManyToOne(() => FundingProvider, (provider) => provider.transactions, { eager: true })
  provider: FundingProvider;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentReference: string;  // Referencia de pago generada

  @Column({ default: 'success' })  // 'success' o 'failed'
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  failureReason?: string;  // Motivo del fallo en caso de 'failed'

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;  // Datos adicionales como la respuesta del banco, etc.
}
