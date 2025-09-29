import { IsString } from 'class-validator';

export class ProductAttrVarIdDto {
  @IsString()
  id: string;
}
