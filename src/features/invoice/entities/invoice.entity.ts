import { Customer } from 'src/features/customer/entities/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('invoices')
export class Invoice {

  
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  dueDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ length: 5 })
  reference: string;

  // 
  
  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer; // Relación con el cliente



  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
