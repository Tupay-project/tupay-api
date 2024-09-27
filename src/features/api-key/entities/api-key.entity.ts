import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('client_keys')

export class ApiKey {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    clientName: string; // Nombre del cliente
  
    @Column()
    accessKey: string; // Clave pública (AccessKey)
  
    @Column()
    privateKey: string; // Clave privada (PrivateKey)
}
