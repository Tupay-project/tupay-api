import { PaymentProvider } from "src/features/provider/entities/provider.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

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
    @ManyToOne(() => PaymentProvider, (provider) => provider.apiKeys)
    fundingProvider: PaymentProvider; // Relación con el proveedor de fondos


}
