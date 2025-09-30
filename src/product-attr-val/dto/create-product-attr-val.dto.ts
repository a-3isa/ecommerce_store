import { IsString } from 'class-validator';

export class CreateProductAttrValDto {
  @IsString()
  attrId: string;

  @IsString()
  value: string;
}
