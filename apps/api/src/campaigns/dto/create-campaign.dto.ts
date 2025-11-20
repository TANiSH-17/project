import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export enum MetricTypeEnum { VIEWS='VIEWS', CLICKS='CLICKS', INTERACTIONS='INTERACTIONS', CONVERSIONS='CONVERSIONS' }

export class CreateCampaignDto {
  @IsString()
  title!: string;

  @IsString()
  brief!: string;

  @IsOptional()
  @IsString()
  guidelines?: string;

  @IsOptional()
  @IsString()
  targetUrl?: string | null;

  @IsInt() @Min(0)
  budgetTotal!: number;

  @IsInt() @Min(0)
  budgetRemaining!: number;

  @IsString()
  currency: string = 'USD';

  @IsEnum(MetricTypeEnum)
  metricType: MetricTypeEnum = MetricTypeEnum.VIEWS;

  @IsInt() @Min(0)
  ratePerThousand!: number;

  @IsOptional() @IsString()
  brandName?: string;

  @IsOptional() @IsString()
  email?: string;
}
