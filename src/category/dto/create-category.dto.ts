import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto } from 'src/common/dto/common.dto';

export class CreateCategoryDto extends BaseCreateDto {
  @ApiPropertyOptional({ description: 'Parent category ID' })
  @IsOptional()
  @IsUUID()
  public parentId?: string;
}
