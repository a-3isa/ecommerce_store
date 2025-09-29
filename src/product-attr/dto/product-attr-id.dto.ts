import { IsString } from 'class-validator';

export class ProductAttrIdDto {
  @IsString()
  id: string;
}
