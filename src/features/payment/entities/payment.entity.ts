import { Customer } from 'src/features/customer/entities/customer.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', nullable: false })
  amount: number;  // Monto del pago (obligatorio)

  @Column({ nullable: false })
  currency: string;  // Moneda (COP, USD, etc.) (obligatorio)

  @Column({ default: 'pending', nullable: true })
  status: string;  // Estado del pago (opcional)

  @Column({ nullable: true })
  method: string;  // Método de pago (opcional)

  @Column({ nullable: true })
  paymentReference: string;  // Referencia de la pasarela de pagos (opcional)

  @Column({ nullable: true })
  bankAgreementNumber: string;  // Número de acuerdo con el banco (opcional)

  @Column({ nullable: true })
  paymentReceipt: string;  // Recibo de pago (opcional)

  @Column({ nullable: true })
  accountNumber: string;  // Número de cuenta (opcional)

  @Column({ nullable: true })
  accountType: string;  // Tipo de cuenta (opcional)

  @Column({ nullable: true })
  supportDocument: string;  // Documento de soporte (opcional)

  // Relación con el cliente que realizó el pago
  @ManyToOne(() => Customer, (customer) => customer.payments, { eager: true })
  customer: Customer;

  // Relación con el proveedor que recibe el pago
  @ManyToOne(() => PaymentProvider, (provider) => provider.payments, { eager: true })
  provider: PaymentProvider;

  @CreateDateColumn()
  createdAt: Date;  // Cuándo se generó la transacción

  @UpdateDateColumn()
  updatedAt: Date;  // Cuándo se actualizó la transacción
}
