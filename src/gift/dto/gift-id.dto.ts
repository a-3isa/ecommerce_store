import { IsUUID } from 'class-validator';

export class GiftIdDto {
  @IsUUID()
  id: string;
}
