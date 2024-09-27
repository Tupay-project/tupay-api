import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  
  @Column()
  eventType: string;

  @Column('text')
  payload: string; // Almacena el payload completo como un JSON string

  @Column({ default: 'success' })
  status: string;

  @Column('json')
  response: Record<string, any>;

}
