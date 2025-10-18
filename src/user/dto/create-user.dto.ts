import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Shipping address' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ description: 'Billing information' })
  @IsString()
  billingInfo: string;
}
