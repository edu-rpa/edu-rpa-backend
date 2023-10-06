import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<Omit<User, 'hashedPassword'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    
    const isMatchPassword = await bcrypt.compare(password, user.hashedPassword);
    if (isMatchPassword) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async signJwt(user: Omit<User, 'hashedPassword'>) {
    const payload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerUser(registerDto: RegisterDto) {
    return 'register';
  }
}
