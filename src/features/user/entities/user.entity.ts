import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importa los decoradores de GraphQL
import { Customer } from 'src/features/customer/entities/customer.entity';
import { Role } from 'src/features/role/entities/roles.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';

@ObjectType() // Decorador para GraphQL
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
  password: string

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
  profilePicture: string
  @Column({ default: 'active' })
  @Field()
  status: string;

  @OneToOne(() => Customer, customer => customer.user)
  @JoinColumn()
  @Field(() => Customer)
  customer: Customer;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
