import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' }) // Valida se é um email
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsBoolean()
    status: boolean;

    @IsNotEmpty()
    @IsNumber()
    profile_id: number;
}
