/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private jwtService: JwtService,
  ) {}

  public async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, email, password, shippingAddress, billingInfo } =
      createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      shippingAddress,
      billingInfo,
    });
    try {
      await this.userRepository.insert(user);
      // Create cart for new user
      const cart = this.cartRepository.create({ user: user });
      await this.cartRepository.insert(cart);
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new NotFoundException(`User not found`);
  }

  public async adminRegister(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, email, password, shippingAddress, billingInfo } =
      createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      shippingAddress,
      billingInfo,
    });
    try {
      const savedUser = await this.userRepository.save(user);
      // Create cart for new user
      const cart = this.cartRepository.create({ user: savedUser });
      await this.cartRepository.save(cart);
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
