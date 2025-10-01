import { IsUUID } from 'class-validator';

export class CategoryIdDto {
  @IsUUID()
  id: string;
}
