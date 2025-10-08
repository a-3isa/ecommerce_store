import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return 'Welcome to the store';
  }

  @Post('/login')
  public login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsDto);
  }

  // @UseGuards(RoleGuard)
  @Post('/adminRegister')
  public async adminRegister(@Body() createUserDto: CreateUserDto) {
    await this.authService.adminRegister(createUserDto);
    return 'Welcome to the store';
  }
}
