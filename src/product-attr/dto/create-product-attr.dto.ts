import { IsString } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  public displayName: string;
}
