import { IsString } from 'class-validator';

export class ProductAttrValIdDto {
  @IsString()
  id: string;
}
