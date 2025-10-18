import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseCreateDto {
  @ApiProperty({ description: 'Name' })
  @IsString()
  public name: string;

  @ApiProperty({ description: 'Slug' })
  @IsString()
  public slug: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  public description?: string;
}

export class BaseIdDto {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  public id: string;
}

export class BaseUpdateDto {
  @ApiPropertyOptional({ description: 'Name' })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional({ description: 'Slug' })
  @IsOptional()
  @IsString()
  public slug?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  public description?: string;
}
