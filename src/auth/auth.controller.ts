import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public async register(@Body() authCredentialsDto: AuthCredentialsDto) {
    await this.authService.register(authCredentialsDto);
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
  public async adminRegister(@Body() authCredentialsDto: AuthCredentialsDto) {
    await this.authService.adminRegister(authCredentialsDto);
    return 'Welcome to the store';
  }
}
