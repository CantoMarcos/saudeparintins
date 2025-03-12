import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "./entity/profile.entity";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { ProfileHasPolicy } from "./entity/profile_has_route_policy.entity";
import { RoutePolicy } from "./entity/route_policy.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile, ProfileHasPolicy, RoutePolicy]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService]
})

export class ProfilModule {}