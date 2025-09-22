/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User, UserRole } from 'src/user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
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

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException();
  }

  async adminRegister(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    console.log(user);
    try {
      await this.userRepository.save(user);
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
