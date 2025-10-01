import { IsOptional, IsUUID } from 'class-validator';
import { BaseCreateDto } from 'src/common/dto/common.dto';

export class CreateCategoryDto extends BaseCreateDto {
  @IsOptional()
  @IsUUID()
  public parentId?: string;
}
