import { Invoice } from 'src/features/invoice/entities/invoice.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bank_transactions')
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.id, { eager: true })
  invoice: Invoice;  // Relación con la factura asociada

  @ManyToOne(() => FundingProvider, (provider) => provider.id, { eager: true })
  provider: FundingProvider;  // Proveedor de fondos

  @Column()
  status: string;  // Estado de la transacción (success/failed)

  @Column()
  transactionDate: Date;  // Fecha de la transacción

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
