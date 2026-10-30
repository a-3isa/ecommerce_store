import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateProductAttrDto } from 'src/product-attr/dto/update-product-attr.dto';

describe('ValidationPipe', () => {
  const pipe = new ValidationPipe();
  const body = (metatype: new () => object) => ({
    type: 'body' as const,
    metatype,
  });

  it('drops properties the DTO does not declare', async () => {
    const result = await pipe.transform(
      { username: 'alice', role: 'admin', id: 'other-user' },
      body(UpdateUserDto),
    );

    expect(result).toEqual({ username: 'alice' });
  });

  it('keeps declared optional fields', async () => {
    const result = await pipe.transform(
      { displayName: 'Colour' },
      body(UpdateProductAttrDto),
    );

    expect(result).toEqual({ displayName: 'Colour' });
  });

  it('rejects declared fields with invalid values', async () => {
    await expect(
      pipe.transform({ username: 42 }, body(UpdateUserDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
