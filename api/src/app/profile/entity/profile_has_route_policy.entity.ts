import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { RoutePolicy } from './route_policy.entity';

@Entity('profile_has_policy')
export class ProfileHasPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' }) 
  profile: Profile;

  @ManyToOne(() => RoutePolicy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_policy_id' })
  routePolicy: RoutePolicy;
}
