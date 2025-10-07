import { IsArray } from 'class-validator';

export interface itemsDto {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
export class CreateOrderDto {
  @IsArray()
  items: itemsDto[];
}
