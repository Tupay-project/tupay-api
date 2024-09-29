import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { FundingProvider } from "../../funding-provider/entities/provider.entity";

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

    // Relación ManyToOne con FundingProvider
    @ManyToOne(() => FundingProvider, (provider) => provider.apiKeys)
    fundingProvider: FundingProvider; // Relación con el proveedor de fondos
}
