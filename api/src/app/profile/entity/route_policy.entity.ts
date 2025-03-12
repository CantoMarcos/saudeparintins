import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('route_policy')
export class RoutePolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
}
