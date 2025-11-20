import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
