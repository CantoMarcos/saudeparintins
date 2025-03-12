import { Controller, Post, Body, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RouteService } from '../route/route.service';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('verify_permission')
  async verifyPermission(@Body() payload: { profile_name: string; route: string }): Promise<{ hasPermission: boolean }> {
    const { profile_name, route } = payload;

    const result = await this.routeService.verifyPermission(profile_name, route);

    if (result === 'PROFILE_NOT_FOUND') {
      throw new NotFoundException('Profile not found');
    }

    if (result === 'PERMISSION_DENIED') {
      throw new ForbiddenException('Permission denied');
    }

    return { hasPermission: true };
  }
}
