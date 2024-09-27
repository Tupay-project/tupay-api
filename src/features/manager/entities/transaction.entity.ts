import { Provider } from 'src/features/funding-provider/entities/provider.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50 })
  type: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Provider)
  provider: Provider;

  @Column({ length: 5 })
  reference: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
