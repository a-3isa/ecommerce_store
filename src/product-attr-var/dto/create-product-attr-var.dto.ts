import {
  IsNumber,
  IsString,
  IsUUID,
  IsArray,
  IsPositive,
} from 'class-validator';

export class CreateProductAttrVarDto {
  @IsNumber()
  public price: number;

  @IsString()
  public instructions: string;

  @IsUUID()
  public productId: string;

  @IsPositive()
  public stock: number;

  @IsArray()
  @IsUUID('4', { each: true })
  public attributeValueIds: string[];
}
