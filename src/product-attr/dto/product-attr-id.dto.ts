import { BaseIdDto } from 'src/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttrIdDto extends BaseIdDto {
  @ApiProperty({ description: 'Product attribute ID' })
  declare id: string;
}
