import { BaseIdDto } from 'src/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttrVarIdDto extends BaseIdDto {
  @ApiProperty({ description: 'Product attribute variation ID' })
  declare id: string;
}
