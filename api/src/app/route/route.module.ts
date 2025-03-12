import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteController } from '../route/route.controller';
import { RouteService } from '../route/route.service';
import { Profile } from '../profile/entity/profile.entity';
import { Route } from '../route/entity/route.entity';
import { ProfileHasRoute } from '../route/entity/profile_has_route';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Route, ProfileHasRoute])],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
