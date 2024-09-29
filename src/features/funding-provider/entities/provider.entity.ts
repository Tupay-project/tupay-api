import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@ObjectType() // Decorador necesario para GraphQL
@Entity('providers')
export class FundingProvider {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID) 
  id: string;

  @Column({ length: 100 })
  @Field() 
  name: string;

  @Column({ unique: true, length: 20 })
  @Field() 
  accountNumber: string;

  @Column({ default: 'active' })
  @Field() 
  status: string;

  @Column()
  @Field() 
  type: string; // Puede ser 'bank', 'person', 'company'

  @Column({ unique: true,nullable:true })
  @Field() 
  privateKey: string;


  @Field() 
  @Column({ nullable: true }) // La AccessKey se almacena aquí
  accessKey: string;
  

  @OneToMany(() => Customer, (customer) => customer.provider)
  @Field(() => [Customer]) // Indica que es una lista de Customer en GraphQL
  customers: Customer[];

  @OneToMany(() => Transaction, (transaction) => transaction.provider)
  @Field(() => [Transaction]) // Indica que es una lista de Transaction en GraphQL
  transactions: Transaction[];

  @CreateDateColumn()
  @Field() 
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Puede ser nulo en GraphQL
  webhookUrl: string;

  @Column({ type: 'decimal', default: 0, nullable: false })
  @Field() 
  availableFunds: number;

  @ManyToOne(() => User, user => user.providers)  // Un proveedor es creado por un solo usuario
  createdBy: User;  // Almacena la referencia al usuario que creó el proveedor


  @UpdateDateColumn()
  @Field() 
  updatedAt: Date;
}
