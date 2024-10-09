import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column()
    description: string;

    @Column()
    issueDate: Date;

    @Column()
    dueDate: Date;

    @Column({ unique: true })
    paymentReference: string;

    @Column()
    paymentLink: string;

    @Column({ default: 'pending' })
    status: string;

    // Información del cliente, que se toma directamente del DTO
    @Column()
    numdoc: string;

    @Column()
    username: string;

    @Column()
    userphone: string;

    @Column()
    useremail: string;

    @Column()
    typetransaction: string;

    @Column()
    method: string;

    // ID del usuario que crea el enlace (creador de la factura)
    @Column()
    createdBy: string;  // Almacenamos el ID del usuario autenticado

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
