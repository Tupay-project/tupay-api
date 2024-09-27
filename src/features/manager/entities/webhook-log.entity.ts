import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Transaction)
  transaction: Transaction;

  @Column({ default: 'success' })
  status: string;

  @Column('json')
  response: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
