import { IsString, IsOptional, IsUUID } from 'class-validator';

export class BaseCreateDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class BaseIdDto {
  @IsUUID()
  public id: string;
}

export class BaseUpdateDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public slug?: string;

  @IsOptional()
  @IsString()
  public description?: string;
}
