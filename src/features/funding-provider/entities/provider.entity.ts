import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
