import { IsString } from 'class-validator';

export class ProductIdDto {
  @IsString()
  id: string;
}
