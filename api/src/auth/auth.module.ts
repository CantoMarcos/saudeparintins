import { Global, Module } from "@nestjs/common";
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/app/user/entity/user.entity";
import jwtConfig from './config/jwt.config';
import { ConfigModule } from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt"
import { Profile } from "src/app/profile/entity/profile.entity";
import { ProfileHasPolicy } from "src/app/profile/entity/profile_has_route_policy.entity";
import { ProfileHasRoute } from "src/app/route/entity/profile_has_route";
import { Route } from "src/app/route/entity/route.entity";

@Global()
@Module({
    imports:[TypeOrmModule.forFeature([User,Profile, ProfileHasPolicy, ProfileHasRoute, Route]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
    ],
    controllers: [
        AuthController],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService
        },
        AuthService
        ],
    exports: [HashingService, JwtModule, ConfigModule]
})
export class AuthModule {}