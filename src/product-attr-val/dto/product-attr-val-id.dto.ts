import { BaseIdDto } from 'src/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttrValIdDto extends BaseIdDto {
  @ApiProperty({ description: 'Product attribute value ID' })
  declare id: string;
}
