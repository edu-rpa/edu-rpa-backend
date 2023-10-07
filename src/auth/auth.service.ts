import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from 'src/schemas/otp.schema';
import { Model } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { CannotRequestOtpException, EmailAlreadyExistsException, InvalidOtpException } from 'src/common/exceptions';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
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
    await this.checkIfEmailExists(registerDto.email);
    const otpCode = await this.generateOtpCode();
    await this.createOtp(registerDto, otpCode);
    await this.emailService.sendEmailWithHtml(
      registerDto.email,
      'OTP Code',
      `Your OTP Code is <b>${otpCode}</b>.`
    );
    return { email: registerDto.email };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otp = await this.otpModel.findOne({ email: verifyOtpDto.email });
    if (!otp || otp.code !== verifyOtpDto.otpCode) {
      throw new InvalidOtpException();
    }

    const user = await this.usersService.create({
      email: otp.email,
      name: otp.tempName,
      hashedPassword: otp.tempHashedPassword,
    });

    await this.otpModel.deleteOne({ email: otp.email });

    return this.signJwt(user);
  }

  private async checkIfEmailExists(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new EmailAlreadyExistsException();
    }
  }

  private async generateOtpCode() {
    const otp = speakeasy.totp({
      secret: speakeasy.generateSecret().base32,
      digits: 6,
    });
    return otp;
  }

  private async createOtp({
    email,
    name,
    password,
  }: RegisterDto, otpCode: string) {
    const existingOtp = await this.otpModel.findOne({ email });
    if (existingOtp) {
      const now = new Date();
      const timeDiff = now.getTime() - existingOtp.createdAt.getTime();
      const timeDiffSeconds = timeDiff / 1000;
      if (timeDiffSeconds <= 60) {
        throw new CannotRequestOtpException();
      } else {
        await this.otpModel.deleteOne({ email });
      }
    }

    const otp = new this.otpModel({ 
      email, 
      code: otpCode,
      tempName: name,
      tempHashedPassword: await bcrypt.hash(password, 10),
    });
    await otp.save();
  }
}
