import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profile/entity/profile.entity';
import { Route } from '../route/entity/route.entity';
import { ProfileHasRoute } from '../route/entity/profile_has_route';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(ProfileHasRoute)
    private readonly profileHasRouteRepository: Repository<ProfileHasRoute>,
  ) {}

  async verifyPermission(profileName: string, routeName: string): Promise<boolean | string> {
    const profile = await this.profileRepository.findOne({ where: { name: profileName } });
    if (!profile) return 'PROFILE_NOT_FOUND';

    const route = await this.routeRepository.findOne({ where: { name: routeName } });
    if (!route) return 'PERMISSION_DENIED';

    const permission = await this.profileHasRouteRepository.findOne({
      where: { profile: { id: profile.id }, routePolicy: { id: route.id } },
    });

    return permission ? true : 'PERMISSION_DENIED';
  }
}
