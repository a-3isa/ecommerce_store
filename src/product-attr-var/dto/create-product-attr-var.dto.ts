import { IsNumber, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateProductAttrVarDto {
  @IsNumber()
  public price: number;

  @IsString()
  public instructions: string;

  @IsUUID()
  public productId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  public attributeValueIds: string[];
}
