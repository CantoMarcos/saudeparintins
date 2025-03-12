import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Profile } from '../../profile/entity/profile.entity';
import { Route } from './route.entity';

@Entity('profile_has_route')
export class ProfileHasRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' }) 
  profile: Profile;

  @ManyToOne(() => Route, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  routePolicy: Route;
}
