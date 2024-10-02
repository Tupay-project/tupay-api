import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { FundingProvider } from 'src/features/funding-provider/entities/provider.entity';
import { Loan } from 'src/features/loan/entities/loan.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Role } from 'src/features/role/entities/roles.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  password: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Field(() => [Role])
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  balance: number;

  @Column({ unique: true, length: 20, nullable: true })
  @Field({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  profilePicture: string;

  @Column({ default: 'active' })
  @Field()
  status: string;

  @OneToOne(() => Customer, customer => customer.user)
  @JoinColumn()
  @Field(() => Customer)
  customer: Customer;

  @ManyToOne(() => Loan, user => user.borrower)
  loans: Loan;

  @OneToMany(() => FundingProvider, provider => provider.createdBy)
  providers: FundingProvider[];

  // Relación para indicar quién creó este usuario
  @ManyToOne(() => User, user => user.createdUsers)
  @JoinColumn({ name: 'created_by' })
  @Field(() => User, { nullable: true })
  createdBy: User;

  @OneToMany(() => User, user => user.createdBy)
  @Field(() => [User], { nullable: true })
  createdUsers: User[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column({ nullable: true })
  privateKey?: string;

  @Column({ nullable: true })
  accessKey?: string;


  @Column({ nullable: true })
  @Field({ nullable: true }) // Puede ser nulo en GraphQL
  webhookUrl: string;



  @Column({ type: 'decimal', default: 0, nullable: false })
  @Field() 
  availableFunds: number;


  @OneToMany(() => Transaction, (transaction) => transaction.user) // Relación con Transaction
  transactions: Transaction[];
}
