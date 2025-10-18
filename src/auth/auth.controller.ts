import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return 'Welcome to the store';
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsDto);
  }

  // @UseGuards(RoleGuard)
  @Post('/adminRegister')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async adminRegister(@Body() createUserDto: CreateUserDto) {
    await this.authService.adminRegister(createUserDto);
    return 'Welcome to the store';
  }
}
