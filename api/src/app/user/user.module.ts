import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ProfilModule } from "../profile/profile.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ProfilModule
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}