import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    required: false,
    minLength: 4,
    maxLength: 12,
    description: 'Username (optional)',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  public username: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  @ApiProperty({ minLength: 8, maxLength: 12, description: 'User password' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  public password: string;
}
