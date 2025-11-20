import { IsString, IsUrl, IsOptional } from 'class-validator';

export class SubmitDto {
  @IsString()
  platform!: string;

  @IsUrl()
  postUrl!: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
