import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    minLength: 8,
    maxLength: 12,
    description: 'Old password for verification',
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(12)
  oldPassword: string;

  @ApiPropertyOptional({ description: 'Shipping address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Billing information' })
  @IsString()
  @IsOptional()
  billingInfo?: string;
}
