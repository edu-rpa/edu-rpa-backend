import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from 'src/auth/schema/otp.schema';
import { Model } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { CannotRequestOtpException, EmailAlreadyExistsException, InvalidOtpException, InvalidStateException } from 'src/common/exceptions';
import { EmailService } from 'src/email/email.service';
import { ResendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { ConnectionService, UserTokenFromProvider } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private connectionSerivce: ConnectionService,
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

  async signJwt(user: Pick<User, 'email' | 'id'>) {
    const payload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerUser(registerDto: RegisterDto) {
    await this.checkIfEmailExists(registerDto.email);
    const otpCode = await this.generateOtpCode();
    await this.createOtp(registerDto, otpCode);
    await this.emailService.sendOtpEmail(registerDto.email, otpCode);
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

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const otpCode = await this.generateOtpCode();
    await this.updateOtp(resendOtpDto, otpCode);
    await this.emailService.sendOtpEmail(resendOtpDto.email, otpCode);
    return { email: resendOtpDto.email };
  }

  async authorizeUserFromProvider(userToken: UserTokenFromProvider, state: string, provider: AuthorizationProvider) {
    let fromUser: number;
    try {
      fromUser = JSON.parse(state).fromUser;
      if (!fromUser || Number.isNaN(fromUser)) {
        throw new Error();
      }
    } catch (error) {
      throw new InvalidStateException();
    }

    const { accessToken, refreshToken, profile } = userToken;
    const email = profile.emails?.[0].value;
    await this.connectionSerivce.createConnection({
      fromUser,
      accessToken,
      refreshToken,
      email,
      provider,
    });
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

  private async checkIfCanRequestOtp(email: string, context: 'create' | 'update') {
    const existingOtp = await this.otpModel.findOne({ email });
    if (!existingOtp) {
      if (context === 'update') {
        throw new CannotRequestOtpException();
      } else {
        return;
      }
    }

    const now = new Date();
    const timeDiff = now.getTime() - existingOtp.createdAt.getTime();
    const timeDiffSeconds = timeDiff / 1000;
    if (timeDiffSeconds <= 60) {
      throw new CannotRequestOtpException();
    } else if (context === 'create') {
      await this.otpModel.deleteOne({ email });
    }
  }

  private async createOtp({
    email,
    name,
    password,
  }: RegisterDto, otpCode: string) {
    await this.checkIfCanRequestOtp(email, 'create');

    const otp = new this.otpModel({ 
      email, 
      code: otpCode,
      tempName: name,
      tempHashedPassword: await bcrypt.hash(password, 10),
    });
    await otp.save();
  }

  private async updateOtp({ email }: ResendOtpDto, otpCode: string) {
    await this.checkIfCanRequestOtp(email, 'update');

    await this.otpModel.updateOne(
      { email },
      { code: otpCode, createdAt: new Date() }
    );
  }
}
