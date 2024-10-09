import { Customer } from 'src/features/customer/entities/customer.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;  // Monto del pago

  @Column()
  currency: string;  // Moneda (COP, USD, etc.)

  @Column({ default: 'pending' })
  status: string;  // Estado del pago (pending, completed, failed, etc.)

  @Column()
  method: string;  // Método de pago (GEN, PSE, etc.)

  @Column({ nullable: true })
  paymentReference: string;  // Referencia de la pasarela de pagos

  // Relación con el cliente que realizó el pago
  @ManyToOne(() => Customer, (customer) => customer.payments, { eager: true })
  customer: Customer;

  // Relación con el proveedor que recibe el pago
  @ManyToOne(() => PaymentProvider, (provider) => provider.payments, { eager: true })
  provider: PaymentProvider;

  @CreateDateColumn()
  createdAt: Date;  // Cuándo se generó la transacción

  @UpdateDateColumn()
  updatedAt: Date;  // Cuándo se actualizó la transacción (por ejemplo, cuando se confirmó)
}
