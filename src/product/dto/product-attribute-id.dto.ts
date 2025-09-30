import { IsString } from 'class-validator';

export class ProductAttributeIdDto {
  @IsString()
  public attributeId: string;
}
