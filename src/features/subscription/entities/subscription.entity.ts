import { Customer } from "src/features/customer/entities/customer.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";


@Entity('subscriptions')
export class Subscription {

    @PrimaryGeneratedColumn('uuid') // Asegura que el ID se maneje como UUID
    id: string;
  
    @Column()
    productId: string;  // ID del producto asociado a la suscripción
  
    @Column()
    pacMandateId: string;  // ID del mandato PAC
    
  @ManyToOne(() => Customer, (customer) => customer.subscriptions)
  customer: Customer;  // Relación con el cliente
}
