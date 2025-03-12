import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
