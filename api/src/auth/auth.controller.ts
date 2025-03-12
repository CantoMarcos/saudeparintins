import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService){}

    @Post()
    @UsePipes(new ValidationPipe())
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @Post('refresh')
    @UsePipes(new ValidationPipe())
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
        return this.authService.refreshTokens(refreshTokenDto)
    }

}