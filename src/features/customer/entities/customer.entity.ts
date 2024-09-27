import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid') // Define el ID como UUID si usas UUIDs
  id: string;

  @Column({ unique: true })
  governmentId: string;  // ID del gobierno (cédula o similar)

  @Column()
  email: string;  // Email del cliente

  @Column()
  name: string;  // Nombre del cliente

  @Column()
  phoneNumber: string;  // Número de teléfono del cliente

 
}
