import { Customer } from 'src/features/customer/entities/customer.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('providers')
export class FundingProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 20 })
  accountNumber: string;

  @Column({ default: 'active' })
  status: string;

  @Column()
  type: string; // Puede ser 'bank', 'person', 'company'

  @Column('float')
  availableFunds: number; // Fondos disponibles para préstamos

  @Column({ unique: true })
  privateKey: string;

  @OneToMany(() => Customer, (customer) => customer.provider)
  customers: Customer[];

  @OneToMany(() => Transaction, (transaction) => transaction.provider)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
  
  @Column({ nullable: true })
  webhookUrl: string; // Aquí se almacena la URL del webhook del proveedor


  @UpdateDateColumn()
  updatedAt: Date;
}
