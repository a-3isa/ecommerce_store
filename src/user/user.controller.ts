import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public findAll() {
    return this.userService.findAll();
  }
  @Get('/me')
  public getMe(@GetUser() user: User) {
    return this.userService.getMe(user.id);
  }

  @Get('/:id')
  public findOne(@Param('id') id: string) {
    console.log('a7a');
    return this.userService.findOne(id);
  }

  @Patch()
  public update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }

  @Delete('/:id')
  public remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
