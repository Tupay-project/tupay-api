import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/features/user/entities/user.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.loans)
  borrower: User; // El usuario que ha adquirido el préstamo o deuda

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // El monto original del préstamo

  @Column('decimal', { precision: 10, scale: 2 })
  outstandingBalance: number; // El saldo pendiente del préstamo (cantidad que debe pagarse)

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  interestRate: number; // El interés aplicado al préstamo

  @Column({ default: 'active' })
  status: string; // El estado del préstamo (ej. 'active', 'paid', 'overdue')

  @OneToMany(() => Transaction, transaction => transaction.loan)
  transactions: Transaction[]; // Lista de transacciones relacionadas con este préstamo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Otros detalles adicionales que quieras agregar, como el plazo del préstamo, fechas de vencimiento, etc.
}
