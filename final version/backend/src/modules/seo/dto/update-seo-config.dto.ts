import { IsOptional, IsString, IsUrl, IsBoolean, MaxLength } from 'class-validator';

export class UpdateSeoConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsUrl()
  ogImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;
}
