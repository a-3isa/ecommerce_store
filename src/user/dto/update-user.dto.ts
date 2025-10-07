import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(12)
  oldPassword: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  billingInfo?: string;
}
