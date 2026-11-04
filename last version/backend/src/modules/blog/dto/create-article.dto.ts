import {
  IsString,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  IsIn,
  IsArray,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(5)
  @MaxLength(250)
  title: string;

  @IsString()
  slug: string;

  @IsString()
  @MinLength(20)
  @MaxLength(600)
  excerpt: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
}
