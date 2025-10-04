import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
